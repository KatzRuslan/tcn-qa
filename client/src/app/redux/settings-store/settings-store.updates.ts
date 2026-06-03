import { PartialStateUpdater } from '@ngrx/signals';
import { ISettingsStoreSlice } from './settings-store.slice';

export function init(): PartialStateUpdater<ISettingsStoreSlice> {
	return _ => ({ });
};