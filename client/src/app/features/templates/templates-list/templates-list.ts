import { Component, computed, input } from '@angular/core';
import { SharedModule } from '@shared-module';
import { copyToClipboard as CopyToClipboard, stopPropagation as StopPropagation } from '@app-helper';
import { ITemplate, ITemplateDetail } from '../templates.interface';

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
    readonly stopPropagation = StopPropagation;
    copyToClipboard(data: ITemplate | ITemplateDetail, { altKey, ctrlKey, metaKey }: PointerEvent, isTemplate = true) {
        switch (true) {
            case (ctrlKey || metaKey) && isTemplate:
                CopyToClipboard((data as ITemplate).name, 'Template Name')
                break;
            case altKey && isTemplate:
                CopyToClipboard(JSON.stringify({ ...data, message: undefined, issues: undefined, details: undefined }, null, 4), 'Template')
                break;
            case (ctrlKey || metaKey) && !isTemplate:
                CopyToClipboard((data as ITemplateDetail).implantId, 'Implant ID');
                break;
            case altKey && !isTemplate:
                CopyToClipboard(JSON.stringify({ ...data, status: undefined, index: undefined }, null, 4), 'Detail')
                break;
        }
    }
}
