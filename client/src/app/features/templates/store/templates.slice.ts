import { ITemplate } from '../templates.interface';

export type TStatus = 'idle' | 'running' | 'done';

export interface ITemplatesSlice {
    readonly total: number;
    readonly faileds: ITemplate[];
    readonly status: TStatus;
};

export const initialTemplatesSlice: ITemplatesSlice = {
    total: 0,
    faileds: [],
    status: 'idle',
};
