import { PartialStateUpdater } from '@ngrx/signals';
import { ITemplatesSlice, TStatus } from './templates.slice';
import { ITemplate } from '../templates.interface';

export function setTotal(total: number): PartialStateUpdater<ITemplatesSlice> {
	return _ => ({ total });
};
export function pushFailed(failed: ITemplate): PartialStateUpdater<ITemplatesSlice> {
	return store => ({ faileds: [...store.faileds, failed] });
};
export function setStatus(status: TStatus): PartialStateUpdater<ITemplatesSlice> {
	return _ => ({ status });
};
export function init(): PartialStateUpdater<ITemplatesSlice> {
	return _ => ({ });
};
