import { Component, inject } from '@angular/core';
import { SharedModule } from '@shared-module';
import { Store } from '../store/templates.store';

@Component({
    selector: 'templates-right',
    imports: [SharedModule],
    templateUrl: './templates-right.html',
    styleUrl: './templates-right.scss',
})
export class TemplatesRight {
    readonly store = inject(Store);
    readonly excelActionItems = [
        {
            label: 'Save Excel', icon: 'pl-4 pi pi-file-excel',
            command: this.store.saveExcel
        },
        {
            label: 'View Excel', icon: 'pl-4 pi pi-file-excel',
            command: this.store.viewExcel
        },
    ];
}
