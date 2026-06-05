import { Component, input } from '@angular/core';

@Component({
    selector: 'main-navigation',
    imports: [],
    templateUrl: './main-navigation.html',
    styleUrl: './main-navigation.scss',
    host: { class: '' },
})
export class MainNavigation {
    readonly widthClass = input.required<string>();
}
