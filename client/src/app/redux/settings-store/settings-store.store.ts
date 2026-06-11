import { Injector, inject, computed } from '@angular/core';
import { signalStore, withState, withProps, withMethods, withComputed, withHooks } from '@ngrx/signals';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { initialSettingsStoreSlice } from './settings-store.slice';
import { putOwner, putServerUrl, putTokenUri } from './settings-store.updates';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';

export const Store = signalStore(
	{ providedIn: 'root' },
	withState(initialSettingsStoreSlice),
	withProps(_ => {
		return {
			_injector: inject(Injector),
		}
	}),
	withMethods(store => {
        return {
            putServerUrl: (serverUrl: string) => updateState(store, '[SettingsStore] Put ServerUrl', putServerUrl(serverUrl)),
            putTokenUri: (tokenUri: string) => updateState(store, '[SettingsStore] Put TokenUri', putTokenUri(tokenUri)),
            putOwner: (owner: string) => updateState(store, '[SettingsStore] Put TokenUri', putOwner(owner)),
        };
    }),
	withComputed(store => ({

	})),
	withHooks({
		onInit(store) {
		},
	}),
	withDevtools('settings-store-store'),
);
