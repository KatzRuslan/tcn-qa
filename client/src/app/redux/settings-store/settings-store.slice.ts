export interface ISettingsStoreSlice {
    readonly serverUrl: string;
    readonly tokenUri: string;
};

export const initialSettingsStoreSlice: ISettingsStoreSlice = {
    // serverUrl: 'https://q-test9-us-east-1-tcneo.quentrytest.com/api',
    serverUrl: 'http://localhost:3000/api',
    // serverUrl: 'https://q-production-us-east-1-tcneo.quentry.com/api',
    tokenUri: 'http://localhost:5011/auth',
};
