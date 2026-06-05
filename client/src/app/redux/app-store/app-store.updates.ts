import { PartialStateUpdater } from '@ngrx/signals';
import { IAppStoreSlice } from './app-store.slice';

export function putAuthorization(authorization: string): PartialStateUpdater<IAppStoreSlice> {
	return _ => ({ authorization });
};
export function onNavigationChange(state: string, header: string): PartialStateUpdater<IAppStoreSlice> {
	return _ => ({ currentState: { state, header } });
};
export function init(): PartialStateUpdater<IAppStoreSlice> {
	return _ => ({ });
};
