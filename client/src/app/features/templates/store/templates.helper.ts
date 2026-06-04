import { Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICheckImage, ITemplate, ITemplateDetail, ITemplateIssue } from '../templates.interface';
import { catchError, throwError, map, mergeMap, from, of, toArray, filter } from 'rxjs';

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
                return templates.map(template => ({ ...template, issues: [], details: [] }));
            }
            throw new Error(`getTemplates: expected array, got ${JSON.stringify(templates)}`);
        })
    )
}
export function getFamily(template: ITemplate) {
    return ctx.httpClient.post<ITemplate>('templates/family', { familyId: template.id, side: 'left', hasHipAP: true }).pipe(
        map(({ implants }) => {
            const issues: ITemplateIssue[] = [], checkImages: ICheckImage[] = [], details: ITemplateDetail[] = [];
            let index = 0;
            for (const { payload } of implants) {
                const { partNumber, properties, images } = payload;
                if (properties.length === 0) {
                    details.push({ index, partNumber, status: 'EMPT_PROPS' });
                }
                checkImages.push(
                    ...images.map(({ ImageID, view, imageLocation }) => ({
                        index, partNumber, ImageID, view, imageLocation
                    }))
                );
                index++;
            }
            if (details.length) {
                issues.push({ status: 'EMPT_PROPS', message: `${details.length}/${implants.length}` })
            }
            return {
                issues, details, images: checkImages
            };
        }),
        catchError(_ => throwError(() => template))
    );
}
export function checkImages(images: ICheckImage[]) {
    return from(images).pipe(
        mergeMap(
            image => ctx.httpClient.get(`templates/image/${image.imageLocation}`).pipe(
                map(() => undefined as unknown as ICheckImage),
                catchError(() => of(image))
            ),
            10
        ),
        toArray(),
        map((results: ICheckImage[]) => {
            const details = results.filter(Boolean).map(({index, ImageID, partNumber, view }) => ({index, ImageID, partNumber, view, status: 'IMG_404' }));
            const issues = details.length ? [{ status: 'IMG_404', message: `${details.length}/${images.length}` }] : [];
            return {
                details, issues
            }
        })
    );
}
