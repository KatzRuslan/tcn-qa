import { PartialStateUpdater } from '@ngrx/signals';
import { IUserSettingsSlice } from './user-settings.slice';
import { IUserSetting } from '../user-settings.interfaces';

export function initUserSettings(settings: IUserSetting[]): PartialStateUpdater<IUserSettingsSlice> {
	return _ => ({ settings });
};
