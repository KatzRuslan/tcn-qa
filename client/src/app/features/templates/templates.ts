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
            width: '30rem',
            // inputValues: {
            //     vmodel: structuredClone(palette), color,
            //     checks: this.store.palettes().filter(({name}) => this.checks().includes(name)),
            //     labels: this.store.palettes().filter(({name}) => name !== palette.name).map(({label}) => label),
            // },
        })!;
        const subscriber = ref.onClose.subscribe((res: any) => {
            subscriber.unsubscribe();
            if (!res) { return }
            console.log(res)
            // if (name) {
            //     this.store.putPalette(name, res)
            // } else {
            //     this.store.pushPalette(res);
            // }
        });
    }
    constructor() {
        setTimeout(() => {
            this.openConfigurations();
        }, 120);
    }
}
