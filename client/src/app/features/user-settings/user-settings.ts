import { Component, inject } from '@angular/core';
import { Store } from './store/user-settings.store';
import { SharedModule } from '@shared-module';

@Component({
    selector: 'user-settings',
    imports: [SharedModule],
    templateUrl: './user-settings.html',
    styleUrl: './user-settings.scss',
    host: { class: 'flex flex-column p-3 w-full h-full overfow-hidden' },
})
export default class UserSettings {
    readonly store = inject(Store);
    public expandedRows: Record<string, boolean> = {};
}
