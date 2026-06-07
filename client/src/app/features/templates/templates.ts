import { Component, inject } from '@angular/core';
import { Store } from './store/templates.store';
import { SharedModule } from '@shared-module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TemplatesList } from './templates-list/templates-list';
import { Progressbar } from '@shared-components/progressbar/progressbar';
import { TestConfigurations } from './test-configurations/test-configurations';

@Component({
    selector: 'templates',
    imports: [SharedModule, TemplatesList, Progressbar],
    templateUrl: './templates.html',
    styleUrl: './templates.scss',
    host: { class: 'flex flex-column w-full h-full overfow-hidden' },
})
export default class Templates {
    readonly store = inject(Store);
    readonly _dialogService = inject(DialogService);
    readonly actionItems = [
        {
            label: 'Change Configurations',
            command: () => {
                this.openConfigurations();
            }
        },
    ];
    openConfigurations() {
        const ref: DynamicDialogRef = this._dialogService.open(TestConfigurations, {
            header: 'Configurations',
            modal: true,
            closable: true,
            draggable: true,
            width: '60rem',
            inputValues: this.store.inputConfigurations(),
        })!;
        const subscriber = ref.onClose.subscribe((configurations: any) => {
            subscriber.unsubscribe();
            if (!configurations) { return }
            this.store.putConfigurations(configurations);
            this.store.startTest();
        });
    }
}
