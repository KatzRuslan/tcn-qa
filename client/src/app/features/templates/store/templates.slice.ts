import { IConfigurations, ITemplate } from '../templates.interface';

export type TStatus = 'idle' | 'running' | 'done';

export interface ITemplatesSlice {
    readonly total: number;
    readonly faileds: ITemplate[];
    readonly status: TStatus;
    readonly configurations: IConfigurations;
    readonly options: {
        readonly procedures: string[];
        readonly anatomicalRegions: string[];
    }
};

export const initialTemplatesSlice: ITemplatesSlice = {
    total: 0,
    faileds: [],
    status: 'idle',
    configurations: {
        freeText: '',
        procedures: [],
        anatomicalRegions: [],
        sortFactor: 0
    },
    options: {
        procedures: [],
        anatomicalRegions: [],
    },
};
