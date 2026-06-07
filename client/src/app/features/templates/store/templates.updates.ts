import { PartialStateUpdater } from '@ngrx/signals';
import { ITemplatesSlice, TStatus } from './templates.slice';
import { IConfigurations, ITemplate } from '../templates.interface';

export function setTotal(total: number): PartialStateUpdater<ITemplatesSlice> {
	return _ => ({ total });
};
export function clearFaileds(): PartialStateUpdater<ITemplatesSlice> {
	return _ => ({ faileds: [] });
};
export function pushFailed(failed: ITemplate): PartialStateUpdater<ITemplatesSlice> {
	return store => {
        const { id } = store.faileds.find(({ id }) => id === failed.id) ?? {};
        const faileds = id ?
            store.faileds.map(node => node.id === id ? { ...node, issues: [...node.issues, ...failed.issues], details: [...node.details, ...failed.details] } : node) :
            [...store.faileds, failed];
        return { faileds }
    };
};
export function setStatus(status: TStatus): PartialStateUpdater<ITemplatesSlice> {
	return _ => ({ status });
};
export function initStore(options: { procedures: string[]; anatomicalRegions: string[] }): PartialStateUpdater<ITemplatesSlice> {
	return _ => ({ options });
};
export function putConfigurations(configurations: IConfigurations): PartialStateUpdater<ITemplatesSlice> {
	return _ => ({ configurations });
};
export function init(): PartialStateUpdater<ITemplatesSlice> {
	return _ => ({ });
};
