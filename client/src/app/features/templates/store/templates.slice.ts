import { ITemplate } from '../templates.interface';

export interface ITemplatesSlice {
    readonly total: number;
    readonly faileds: ITemplate[];
};

export const initialTemplatesSlice: ITemplatesSlice = {
    total: 0,
    faileds: [],
};
