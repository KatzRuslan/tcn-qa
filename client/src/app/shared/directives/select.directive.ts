import { Directive, OnInit, Injector, DestroyRef, effect, input, inject } from '@angular/core';
import { Select } from 'primeng/select';

const iconUp = 'icon-chevron-up';
const iconDown = 'icon-chevron-down';

@Directive({
    selector: '[select]',
    standalone: true,
})
export class SelectDirective implements OnInit {
    readonly _injector = inject(Injector);
    readonly _destroyRef = inject(DestroyRef);
    readonly _select = inject(Select);
    readonly options = input.required<any[]>();
    readonly readonly = input<boolean>(false);
    ngOnInit(): void {
        this._select.scrollHeight = `${212 / 16}rem`;
        this._select.focusOnHover = false;
        const subscriptions = [
            this._select.onShow.subscribe(({ element }: { element: HTMLElement }) => {
                this._select.dropdownIcon = iconUp;
                for (const option of element.querySelectorAll('.p-select-option') ?? []) {
                    option.addEventListener('mouseenter', () => option.classList.add('p-focus'));
                    option.addEventListener('mouseleave', () => option.classList.remove('p-focus'));
                }
            }),
            this._select.onHide.subscribe(_ => {
                this._select.dropdownIcon = iconDown;
            }),
        ];
        effect(
            () => {
                const list = this.options() ?? [];
                if (list.length <= 1) {
                    this._select.readonly = true;
                    this._select.dropdownIcon = 'none';
                } else if (!this._select.dropdownIcon || this._select.dropdownIcon === 'none') {
                    this._select.readonly = this.readonly() === true;
                    this._select.dropdownIcon = iconDown;
                }
            },
            { injector: this._injector }
        );
        this._destroyRef.onDestroy(() => {
            for (const subscriber of subscriptions) {
                subscriber.unsubscribe();
            }
        });
    }
}
