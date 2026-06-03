import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store as AppStore } from '@app-store';
import { Store as SettingsStore } from '@settings-store';
import { Observable } from 'rxjs';

export async function load() {
    const appStore = inject(AppStore);
    const settingsStore = inject(SettingsStore);
    const jwt = await fetch(settingsStore.tokenUri()).then(res => res.text());
    appStore.putAuthorization(`Bearer ${jwt}`);
    return true;
}

export function interceptor(request: HttpRequest<unknown>,next: HttpHandlerFn,): Observable<HttpEvent<unknown>> {
    const appStore = inject(AppStore);
    return next(request.clone({ url: `${appStore.baseUrl()}/${request.url}`, setHeaders: appStore.getHttpHeaders()}));
}
