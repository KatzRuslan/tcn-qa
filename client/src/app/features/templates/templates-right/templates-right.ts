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
    // readonly items = [
    //     {
    //         label: 'Save JSON', icon: 'pi ',
    //         command: this.store.saveJson
    //     },
    //     { separator: true },
    //     {
    //         label: 'View CSV', icon: 'pi ',
    //         command: this.store.viewCsv
    //     },
    //     {
    //         label: 'View JSON', icon: 'pi ',
    //         command: this.store.viewJson
    //     },
    // ];
}
