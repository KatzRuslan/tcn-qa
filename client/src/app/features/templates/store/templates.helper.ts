import { Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITemplate } from '../templates.interface';
import { catchError, throwError, map, forkJoin, of } from 'rxjs';

/**
 * ⚠️ Singleton helper context.
 *
 * Initialized once from TemplatesStore `onInit`.
 * Assumes a single TemplatesStore instance and
 * that initialization happens before any usage.
 *
 * Not intended for SSR or multiple store instances.
 */
interface IContext {
    readonly httpClient: HttpClient;
}
let ctx!: IContext;
export function initTemplatesStoreHelperContext(context: IContext) {
    ctx = context;
}
//
export function getTemplates() {
    return ctx.httpClient.post<ITemplate[]>('templates/search', { freeText: '', procedures: [], anatomicalRegions: [], sortFactor: 0 }).pipe(
        map(templates => {
            if (Array.isArray(templates)) {
                return templates.map(template => ({ ...template, details: []}));
            }
            throw new Error(`getTemplates: expected array, got ${JSON.stringify(templates)}`);
        })
    )
}
export function getFamily(template: ITemplate) {
    return ctx.httpClient.post<ITemplate>('templates/family', { familyId: template.id, side: 'left', hasHipAP: true }).pipe(
        catchError(_ => throwError(() => template))
    );
}
export function checkImages(template: ITemplate) {
    const images = template.implants.flatMap(i => i.payload.images);
    if (!images.length) {
        return of({ template, count404: 0, total: 0 });
    }
    //
    const checks = images.map(({ imageLocation }) =>
        ctx.httpClient.get(`templates/image/${imageLocation}`).pipe(
            map(() => false),
            catchError(() => of(true))
        )
    );
    //
    return forkJoin(checks).pipe(
        map(results => ({
            template,
            count404: results.filter(Boolean).length,
            total: images.length
        }))
    );
}
