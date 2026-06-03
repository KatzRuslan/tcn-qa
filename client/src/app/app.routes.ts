import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'templates',
        loadComponent: () => import('./features/templates/templates'),
        title: 'TCN QA - Templates Page',
        data: { state: 'templates', header: 'Templates' },
    },
    { path: '', pathMatch: 'full', redirectTo: 'templates' },
];
