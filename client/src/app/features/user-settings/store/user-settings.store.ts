import { Injector, signal, computed, runInInjectionContext, inject } from '@angular/core';
import { signalStore, withState, withProps, withMethods, withComputed, withHooks } from '@ngrx/signals';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { initialUserSettingsSlice } from './user-settings.slice';
import { getSettings, initUserSettingsStoreHelperContext, removeSetting } from './user-settings.helper';
import { initUserSettings } from './user-settings.updates';
import {} from './user-settings.vm-builder';
import { HttpClient } from '@angular/common/http';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { switchMap, pipe, tap } from 'rxjs';
//
import { Store as AppStore } from '@app-store';

export const Store = signalStore(
	{ providedIn: 'root' },
	withState(initialUserSettingsSlice),
	withProps(_ => {
        const injector = inject(Injector);
        let appStore: InstanceType<typeof AppStore> | null = null;
		return {
			_injector: injector,
            httpClient: inject(HttpClient),
            _appStore: (): any => {
                appStore ??= runInInjectionContext(injector, () => inject(AppStore));
                return appStore;
            },
		}
	}),
	withMethods(store => {
        const _getSettings = rxMethod<void>(
            pipe(
                switchMap(
                    _ => getSettings().pipe(
                        tapResponse({
                            next: settings => updateState(store, '[UserSettingsStore Init UserSettings]', initUserSettings(settings)),
                            error: err => console.log(err)
                        })
                    )
                )
            )
        );
        return {
            getSettings: _getSettings,
            removeSetting: rxMethod<string>(
                pipe(
                    switchMap(
                        input$ => removeSetting(input$, store.settings()).pipe(
                            tapResponse({
                                next: _ => _getSettings(),
                                // next: settings => console.log(settings),
                                error: err => console.log(err)
                            })
                        )
                    )
                )
            )
        };
    }),
	withComputed(store => ({

	})),
	withHooks({
		async onInit(store) {
            const { userSettingsNames } = await (globalThis as any).electronAPI.getConfig();
            initUserSettingsStoreHelperContext({
                httpClient: store.httpClient,
                names: userSettingsNames ?? []
            });
            store.getSettings();
		},
	}),
	withDevtools('user-settings-store'),
);
