import { Component, input, inject } from '@angular/core';
import { Store } from '@app-store';
import { TemplatesRight } from '@templates-right';

@Component({
    selector: 'main-header',
    imports: [TemplatesRight],
    templateUrl: './main-header.html',
    styleUrl: './main-header.scss',
    host: { class: 'flex align-items-center gap-3 h-5rem border-bottom-1 border-300 mb-4 px-3' },
})
export class MainHeader {
    readonly store = inject(Store);
    readonly widthClass = input.required<string>();
}
