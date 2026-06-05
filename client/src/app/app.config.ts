import { ApplicationConfig, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';

import { interceptor, load } from '@shared-helpers/initializer.helper';

import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import preset from '@tcn-preset';
export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideHttpClient(withInterceptors([interceptor])),
        provideAppInitializer(load),
        provideRouter(routes, withHashLocation()),
        providePrimeNG({
            ripple: true,
            theme: {
                preset: definePreset(Aura, preset),
                options: {
                    darkModeSelector: '.dark'
                }
            }
        }),
        DialogService,
        ConfirmationService,
        MessageService,
    ]
};
