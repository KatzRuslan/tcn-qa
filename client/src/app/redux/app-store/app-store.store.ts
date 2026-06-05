import { Injector, computed, runInInjectionContext, inject } from '@angular/core';
import { signalStore, withState, withProps, withMethods, withComputed, withHooks } from '@ngrx/signals';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { initialAppStoreSlice } from './app-store.slice';
import { putAuthorization, onNavigationChange } from './app-store.updates';
import { vmBaseUrl } from './app-store.vm-builder';
//
import { Store as SettingsStore } from '@settings-store';

export const Store = signalStore(
	{ providedIn: 'root' },
	withState(initialAppStoreSlice),
	withProps(_ => {
        const injector = inject(Injector);
        let settingsStore: InstanceType<typeof SettingsStore> | null = null;
		return {
			_injector: injector,
            _settingsStore: (): any => {
                if (!settingsStore) { // nosonar (it will need to be repaired)
                    settingsStore = runInInjectionContext(injector, () => inject(SettingsStore));
                }
                return settingsStore;
            },
		}
	}),
	withMethods(store => {
        return {
            putAuthorization: (authorization: string) => updateState(store, '[App Store] Put Authorization', putAuthorization(authorization)),
            onNavigation: (state: string, header: string) => updateState(store, '[App Store] On Navigation Change', onNavigationChange(state, header)),
        };
    }),
	withComputed(store => {
        return {
            getHttpHeaders: computed(() => ({ authorization: store.authorization() })),
            baseUrl: computed(() => vmBaseUrl(store._settingsStore().serverUrl())),
        };
    }),
	withHooks({
		onInit(store) {
		},
	}),
	withDevtools('app-store-store'),
);
