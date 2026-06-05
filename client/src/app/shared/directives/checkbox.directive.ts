import { Directive, OnInit, inject } from '@angular/core';
import { Checkbox } from 'primeng/checkbox';

@Directive({
    selector: 'p-checkbox',
    standalone: true,
})
export class CheckboxDirective implements OnInit {
    readonly _checkbox = inject(Checkbox);
    ngOnInit(): void {
        this._checkbox.checkboxIcon = 'icon-check';
    }
}
