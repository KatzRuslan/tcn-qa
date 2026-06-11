import { Component, input } from '@angular/core';
import { SharedModule } from '@shared-module';

@Component({
    selector: 'main-navigation',
    imports: [SharedModule],
    templateUrl: './main-navigation.html',
    styleUrl: './main-navigation.scss',
    host: { class: '' },
})
export class MainNavigation {
    readonly widthClass = input.required<string>();
    readonly navigation = [
        {
            label: 'User Settings',
            icon: 'pi pi-user-edit',
            routerLink: 'user-settings',
            styleClass: 'navigation-single-item',
        },
        {
            label: 'Templates',
            icon: 'pi pi-image',
            routerLink: 'templates',
            styleClass: 'navigation-single-item',
        },
    ];
}
