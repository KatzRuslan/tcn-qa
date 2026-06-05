import { Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICheckImage, ITemplate, ITemplateDetail, ITemplateIssue } from '../templates.interface';
import { catchError, throwError, map, mergeMap, from, of, toArray, filter } from 'rxjs';
import * as ExcelJS from 'exceljs';

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
            for (const { id, payload } of implants) {
                const { partNumber, properties, images } = payload;
                if (properties.length === 0) {
                    details.push({ index, partNumber, implantId: id, status: 'EMPT_PROPS' });
                }
                checkImages.push(
                    ...images.map(({ ImageID, view, imageLocation }) => ({
                        index, partNumber, ImageID, view, imageLocation, implantId: id
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
            const details = results.filter(Boolean).map(({ index, ImageID, partNumber, view, implantId }) => ({index, ImageID, partNumber, view, implantId, status: 'IMG_404' }));
            const issues = details.length ? [{ status: 'IMG_404', message: `${details.length}/${images.length}` }] : [];
            return {
                details, issues
            }
        })
    );
}
function getCsv(data: Record<string, any>[]): string {
    if (!data.length) return '';
    const headers = Object.keys(data[0]);
    const rows = data.map(row =>
        headers.map(h => JSON.stringify(row[h] ?? '')).join(',')
    );
    return [headers.join(','), ...rows].join('\n');
}
export function saveCsv(data: Record<string, any>[], filename = 'export.csv') {
    const csv = getCsv(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
//
const columnsTemplate = [
    { header: 'Family Name', key: 'name', width: 60 },
    { header: 'Family ID', key: 'id', width: 30 },
    { header: 'Anatomical Region', key: 'anatomicalRegion', width: 30 },
    { header: 'Procedure', key: 'procedure', width: 30 },
    { header: 'Classification', key: 'classification', width: 20 },
    { header: 'Manufacturer', key: 'manufacturer', width: 20 },
];
const headerFont = { bold: true, color: { argb: 'FFFFFFFF' } };
const headerFill: ExcelJS.FillPattern = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
function createNotFoundTemplateSheet(workbook: ExcelJS.Workbook, faileds: ITemplate[]) {
    const sheet = workbook.addWorksheet('Not found templates');
    sheet.columns = columnsTemplate;
    sheet.getRow(1).font = headerFont;
    sheet.getRow(1).fill = headerFill;
    const rows = faileds.filter(({ issues }) => issues.some(({ status }) => status === '404'));
    for (const row of rows) {
        sheet.addRow(row);
    }
}
function createEmptyPropertiesSheet(workbook: ExcelJS.Workbook, faileds: ITemplate[]) {
    const sheet = workbook.addWorksheet('Empty property templates');
    sheet.columns = [
        ...columnsTemplate,
        { header: 'Implant ID', key: 'implantId', width: 30 },
        { header: 'Part Number', key: 'partNumber', width: 20 },
    ];
    sheet.getRow(1).font = headerFont;
    sheet.getRow(1).fill = headerFill;
    const rows = faileds
        .filter(({ issues }) => issues.some(({ status }) => status === 'EMPT_PROPS'))
        .flatMap(({ id, name, anatomicalRegion, procedure, classification, manufacturer, details }) =>
            details.filter(({ status }) => status === 'EMPT_PROPS').map(
                ({ implantId, partNumber }) => ({ id, name, anatomicalRegion, procedure, classification, manufacturer, details, implantId, partNumber })
            )
        );
    for (const row of rows) {
        sheet.addRow(row);
    }
}
function createNotFoundImageSheet(workbook: ExcelJS.Workbook, faileds: ITemplate[]) {
    const sheet = workbook.addWorksheet('Not found images');
    sheet.columns = [
        ...columnsTemplate,
        { header: 'Implant ID', key: 'implantId', width: 30 },
        { header: 'Part Number', key: 'partNumber', width: 20 },
        { header: 'Image ID', key: 'ImageID', width: 12 },
        { header: 'View', key: 'view', width: 12 },
    ];
    sheet.getRow(1).font = headerFont;
    sheet.getRow(1).fill = headerFill;
    const rows = faileds
        .filter(({ issues }) => issues.some(({ status }) => status === 'IMG_404'))
        .flatMap(({ id, name, anatomicalRegion, procedure, classification, manufacturer, details }) =>
            details.filter(({ status }) => status === 'IMG_404').map(
                ({ implantId, partNumber, ImageID, view }) => ({ id, name, anatomicalRegion, procedure, classification, manufacturer, details, implantId, partNumber, ImageID, view })
            )
        );
    for (const row of rows) {
        sheet.addRow(row);
    }
}
async function getExcel(faileds: ITemplate[]): Promise<ArrayBuffer> {
    const workbook = new ExcelJS.Workbook();
    createNotFoundTemplateSheet(workbook, faileds);
    createEmptyPropertiesSheet(workbook, faileds);
    createNotFoundImageSheet(workbook, faileds);
    return workbook.xlsx.writeBuffer();
}
export async function viewExcel(faileds: ITemplate[]) {
    const buffer = await getExcel(faileds);
    (globalThis as any).electronAPI.openExcel(buffer);
}
export async function saveExcel(faileds: ITemplate[]) {
    const buffer = await getExcel(faileds);
    (globalThis as any).electronAPI.saveExcel(buffer);
}
