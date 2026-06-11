import { IUserSetting } from '../user-settings.interfaces';

export interface IUserSettingsSlice {
    readonly settings: IUserSetting[];
};

export const initialUserSettingsSlice: IUserSettingsSlice = {
    settings: [],
};
