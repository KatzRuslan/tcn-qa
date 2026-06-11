import { Routes } from '@angular/router';
import { navigationResolver } from '@shared-helpers/initializer.helper';

export const routes: Routes = [
    {
        path: 'user-settings',
        loadComponent: () => import('./features/user-settings/user-settings'),
        title: 'TCN QA - User Settings Page',
        data: { state: 'user-settings', header: 'User Settings' },
        resolve: [navigationResolver],
    },
    {
        path: 'templates',
        loadComponent: () => import('./features/templates/templates'),
        title: 'TCN QA - Templates Page',
        data: { state: 'templates', header: 'Templates' },
        resolve: [navigationResolver],
    },
    { path: '', pathMatch: 'full', redirectTo: 'user-settings' },
];
