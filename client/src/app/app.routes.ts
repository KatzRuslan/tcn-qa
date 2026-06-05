import { Routes } from '@angular/router';
import { navigationResolver } from '@shared-helpers/initializer.helper';

export const routes: Routes = [
    {
        path: 'templates',
        loadComponent: () => import('./features/templates/templates'),
        title: 'TCN QA - Templates Page',
        data: { state: 'templates', header: 'Templates' },
        resolve: [navigationResolver],
    },
    { path: '', pathMatch: 'full', redirectTo: 'templates' },
];
