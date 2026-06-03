import { Injector, inject, computed } from '@angular/core';
import { signalStore, withState, withProps, withMethods, withComputed, withHooks } from '@ngrx/signals';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { initialSettingsStoreSlice } from './settings-store.slice';

export const Store = signalStore(
	{ providedIn: 'root' },
	withState(initialSettingsStoreSlice),
	withProps(_ => {
		return {
			_injector: inject(Injector),
		}
	}),
	withMethods(store => ({

	})),
	withComputed(store => ({

	})),
	withHooks({
		onInit(store) {
		},
	}),
	withDevtools('settings-store-store'),
);