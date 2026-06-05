import { Directive, OnInit, Injector, DestroyRef, input, effect, inject} from '@angular/core';
import { MultiSelect } from 'primeng/multiselect';

const iconUp = 'icon-chevron-up';
const iconDown = 'icon-chevron-down';

@Directive({
    selector: 'p-multiselect',
    standalone: true,
})
export class MultiSelectDirective implements OnInit {
    readonly _injector = inject(Injector);
    readonly _destroyRef = inject(DestroyRef);
    readonly _multiselect = inject(MultiSelect);
    readonly options = input.required<any[]>();
    readonly readonly = input<boolean>(false);
    ngOnInit(): void {
        this._multiselect.scrollHeight = `${212 / 16}rem`;
        this._multiselect.focusOnHover = false;
        const subscriptions = [
            this._multiselect.onPanelShow.subscribe(({ element }: { element: HTMLElement }) => {
                this._multiselect.dropdownIcon = iconUp;
                for (const option of element.querySelectorAll('.p-multiselect-option') ?? []) {
                    option.addEventListener('mouseenter', () => option.classList.add('p-focus'));
                    option.addEventListener('mouseleave', () => option.classList.remove('p-focus'));
                }
            }),
            this._multiselect.onPanelHide.subscribe(_ => {
                this._multiselect.dropdownIcon = iconDown;
            }),
        ];
        effect(
            () => {
                const list = this.options() ?? [];
                if (list.length <= 1) {
                    this._multiselect.readonly = true;
                    this._multiselect.dropdownIcon = 'none';
                } else if (!this._multiselect.dropdownIcon || this._multiselect.dropdownIcon === 'none') {
                    this._multiselect.readonly = this.readonly() === true;
                    this._multiselect.dropdownIcon = iconDown;
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
