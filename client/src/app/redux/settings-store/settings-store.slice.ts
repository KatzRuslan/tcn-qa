export interface ISettingsStoreSlice {
    readonly serverUrl: string;
    readonly tokenUri: string;
    readonly owner: string;
};

export const initialSettingsStoreSlice: ISettingsStoreSlice = {
    serverUrl: 'http://localhost:3000/api',
    tokenUri: 'http://localhost:5011/auth',
    owner: '',
};
