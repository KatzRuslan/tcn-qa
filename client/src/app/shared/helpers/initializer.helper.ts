import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store as AppStore } from '@app-store';
import { Store as SettingsStore } from '@settings-store';
import { Observable } from 'rxjs';
import { environment } from '@environments';

export async function load() {
    const appStore = inject(AppStore);
    const settingsStore = inject(SettingsStore);
    const config = await (globalThis as any).electronAPI.getConfig();
    if (config.tokenUri) {
        settingsStore.putTokenUri(config.tokenUri);
    }
    if (config.serverUrl) {
        environment.production = false;
        settingsStore.putServerUrl(config.serverUrl);
    }
    if (config.owner) {
        settingsStore.putOwner(config.owner);
    }
    const jwt = config.jwt ? config.jwt : await fetch(settingsStore.tokenUri()).then(res => res.text()).then(token => `Bearer ${token}`);
    appStore.putAuthorization(jwt);
    return true;
}

export function interceptor(request: HttpRequest<unknown>,next: HttpHandlerFn,): Observable<HttpEvent<unknown>> {
    const appStore = inject(AppStore);
    return next(request.clone({ url: `${appStore.baseUrl()}/${request.url}`, setHeaders: appStore.getHttpHeaders()}));
}

export const navigationResolver: ResolveFn<void> = ({ data, params }: ActivatedRouteSnapshot) => {
    let { state, header } = data;
    if (!header && state === 'component-settings') {
        const { components } = data;
        const { name } = params;
        header = components.find((component: { type: string; title: string }) => component.type === name)?.title ?? 'Component Settings';
    }
    const store = inject(AppStore);
    store.onNavigation(state, header);

};
