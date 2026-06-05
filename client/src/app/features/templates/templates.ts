import { Component, inject } from '@angular/core';
import { Store } from './store/templates.store';
import { SharedModule } from '@shared-module';
import { TemplatesList } from './templates-list/templates-list';
import { Progressbar } from '@shared-components/progressbar/progressbar';

@Component({
    selector: 'templates',
    imports: [SharedModule, TemplatesList, Progressbar],
    templateUrl: './templates.html',
    styleUrl: './templates.scss',
    host: { class: 'flex flex-column w-full h-full overfow-hidden' },
})
export default class Templates {
    readonly store = inject(Store);
}
