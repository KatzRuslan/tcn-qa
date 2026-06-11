import { HttpClient } from '@angular/common/http';
import { map, of } from 'rxjs';
import { IUserSetting } from '../user-settings.interfaces';

/**
 * ⚠️ Singleton helper context.
 *
 * Initialized once from UserSettingsStore `onInit`.
 * Assumes a single UserSettingsStore instance and
 * that initialization happens before any usage.
 *
 * Not intended for SSR or multiple store instances.
 */
interface IContext {
    readonly httpClient: HttpClient;
    readonly names: { key: string; value: string; }[],
}
let ctx!: IContext;
export function initUserSettingsStoreHelperContext(context: IContext) {
    ctx = context;
}
//
function getSettingName(key: string) {
    const { value } = ctx.names.find(node => node.key === key) ?? { value: undefined };
    if (value) {
        return value;
    }
    return key
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .split(/[\s_-]+/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
}
export function getSettings() {
    return ctx.httpClient.get('sessions/settings', { params: { key: '' }}).pipe(
        map(settings =>
            Object.entries(settings).map(([key, value]) => ({
                key,
                name: getSettingName(key),
                value: JSON.parse(value)
            }))
        )
    )
}
export function removeSetting(key: string, settings: IUserSetting[]) {
    return ctx.httpClient.delete(`sessions/settings/${key}`);
}
