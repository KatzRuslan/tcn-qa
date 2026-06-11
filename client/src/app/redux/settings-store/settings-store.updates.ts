import { PartialStateUpdater } from '@ngrx/signals';
import { ISettingsStoreSlice } from './settings-store.slice';

export function putServerUrl(serverUrl: string): PartialStateUpdater<ISettingsStoreSlice> {
	return _ => ({ serverUrl });
};
export function putTokenUri(tokenUri: string): PartialStateUpdater<ISettingsStoreSlice> {
	return _ => ({ tokenUri });
};
export function putOwner(owner: string): PartialStateUpdater<ISettingsStoreSlice> {
	return _ => ({ owner });
};
export function init(): PartialStateUpdater<ISettingsStoreSlice> {
	return _ => ({ });
};
