import { Component, input } from '@angular/core';
import { SharedModule } from '@shared-module';
import { ITemplate } from '../templates.interface';

@Component({
    selector: 'templates-list',
    imports: [SharedModule],
    templateUrl: './templates-list.html',
    styleUrl: './templates-list.scss',
    host: { class: 'flex flex-column p-3 w-full h-full overfow-hidden' },
})
export class TemplatesList {
    readonly vmodel = input.required<ITemplate[]>();
}
