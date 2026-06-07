import { ICurrentState } from '@interfaces';

export interface IAppStoreSlice {
    readonly currentState: ICurrentState;
    readonly authorization: string;
};

export const initialAppStoreSlice: IAppStoreSlice = {
    currentState: { state: '', header: '' },
    authorization: '',
};
