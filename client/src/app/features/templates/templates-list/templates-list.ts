import { Component, computed, input } from '@angular/core';
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
    readonly expansion = input.required<boolean>();
    readonly withImageDetails = computed(() => {
        const [{ details }] = this.vmodel();
        const [{ view, ImageID }] = details;
        return !!view && !!ImageID;
    });
    public expandedRows: Record<string, boolean> = {};
}
