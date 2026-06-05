import { Directive, ElementRef, DestroyRef, TemplateRef, input, effect, inject } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';

@Directive({
    selector: '[appTooltip]',
    standalone: true,
})
export class TooltipDirective {
    readonly _elementRef = inject(ElementRef);
    readonly _tooltip = inject(Tooltip);
    readonly pTooltip = input.required<string | TemplateRef<any>>();
    readonly _resizeObserver!: ResizeObserver;
    readonly destroyRef = inject(DestroyRef);
    constructor() {
        effect(() => {
            if (this.pTooltip()) {
                this._calculate();
            }
        });
        this._resizeObserver = new ResizeObserver(() => {
            this._calculate();
        });
        this._resizeObserver.observe(this._elementRef.nativeElement);
        this.destroyRef.onDestroy(() => this._resizeObserver.disconnect());
    }
    private _calculate() {
        const { clientWidth, scrollWidth } = this._tooltip.el.nativeElement;
        const tooltipStyleClassArray = `${this._tooltip._tooltipOptions.tooltipStyleClass ?? ''}`
            .split(' ')
            .filter((classname) => classname && classname !== 'hidden');
        if (scrollWidth <= clientWidth) {
            tooltipStyleClassArray.push('hidden');
        }
        const tooltipStyleClass: string | null = tooltipStyleClassArray.join(' ') || null;
        (this._tooltip._tooltipOptions as any).tooltipStyleClass = tooltipStyleClass;
    }
}
