import { Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICheckImage, IConfigurations, ITemplate, ITemplateDetail, ITemplateIssue } from '../templates.interface';
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
export function getTemplates(configurations: IConfigurations) {
    return ctx.httpClient.post<ITemplate[]>('templates/search', configurations).pipe(
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
//
const columnsTemplate = [
    { header: 'Family Name', key: 'name', width: 60 },
    { header: 'Family ID', key: 'id', width: 30 },
    { header: 'Anatomical Region', key: 'anatomicalRegion', width: 30 },
    { header: 'Procedure', key: 'procedure', width: 30 },
    { header: 'Classification', key: 'classification', width: 20 },
    { header: 'Manufacturer', key: 'manufacturer', width: 20 },
];
const evenFill = 'FFFFFFFF';
const oddFill = 'FFE6E6E6';
const headerFont = { bold: true, color: { argb: 'FFFFFFFF' } };
const headerFill: ExcelJS.FillPattern = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
const rowBorder: Partial<ExcelJS.Borders> = {
    top: { style: 'thin', color: { argb: 'FFA6A6A6' } },
    bottom: { style: 'thin', color: { argb: 'FFA6A6A6' } },
    left: { style: 'thin', color: { argb: 'FFA6A6A6' } },
    right: { style: 'thin', color: { argb: 'FFA6A6A6' } }
};
function createNotFoundTemplateSheet(workbook: ExcelJS.Workbook, faileds: ITemplate[]) {
    const sheet = workbook.addWorksheet('Not found templates');
    sheet.columns = columnsTemplate;
    sheet.getRow(1).font = headerFont;
    sheet.getRow(1).fill = headerFill;
    const rows = faileds.filter(({ issues }) => issues.some(({ status }) => status === '404'));
    let index = 0
    for (const row of rows) {
        const argb = index % 2 === 0 ? evenFill : oddFill;
        const addedRow = sheet.addRow(row);
        addedRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb } };
        addedRow.border = rowBorder;
        index++;
    }
    return rows.length;
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
        .flatMap(({ id, name, anatomicalRegion, procedure, classification, manufacturer, details }, index: number) =>
            details.filter(({ status }) => status === 'EMPT_PROPS').map(
                ({ implantId, partNumber }) => ({ id, name, anatomicalRegion, procedure, classification, manufacturer, details, implantId, partNumber, argb: index % 2 === 0 ? evenFill : oddFill })
            )
        );
    for (const row of rows) {
        const { argb } = row;
        const addedRow = sheet.addRow(row);
        addedRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb } };
        addedRow.border = rowBorder;
    }
}
function createEmptyPropertiesTotalSheet(workbook: ExcelJS.Workbook, faileds: ITemplate[]) {
    const sheet = workbook.addWorksheet('Total empty property templates');
    sheet.columns = [
        ...columnsTemplate,
        { header: 'Status', key: 'message', width: 20 },
    ];
    sheet.getRow(1).font = headerFont;
    sheet.getRow(1).fill = headerFill;
    const rows = faileds
        .filter(({ issues }) => issues.some(({ status }) => status === 'EMPT_PROPS'))
        .map(({ id, name, anatomicalRegion, procedure, classification, manufacturer, issues }, index: number) => {
            const { message } = issues.find(({ status }) => status === 'EMPT_PROPS')!;
            return {
                id, name, anatomicalRegion, procedure,
                classification, manufacturer, message,
                argb: index % 2 === 0 ? evenFill : oddFill
            }
        });
    for (const row of rows) {
        const { argb } = row;
        const addedRow = sheet.addRow(row);
        addedRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb } };
        addedRow.border = rowBorder;
    }
    return rows.length;
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
        .flatMap(({ id, name, anatomicalRegion, procedure, classification, manufacturer, details }, index: number) =>
            details.filter(({ status }) => status === 'IMG_404').map(
                ({ implantId, partNumber, ImageID, view }) => ({ id, name, anatomicalRegion, procedure, classification, manufacturer, details, implantId, partNumber, ImageID, view, argb: index % 2 === 0 ? evenFill : oddFill })
            )
        );
    for (const row of rows) {
        const { argb } = row;
        const addedRow = sheet.addRow(row);
        addedRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb } };
        addedRow.border = rowBorder;
    }
}
function createNotFoundImageTotalSheet(workbook: ExcelJS.Workbook, faileds: ITemplate[]) {
    const sheet = workbook.addWorksheet('Total not found images');
    sheet.columns = [
        ...columnsTemplate,
        { header: 'Status', key: 'message', width: 20 },
    ];
    sheet.getRow(1).font = headerFont;
    sheet.getRow(1).fill = headerFill;
    let totalImages = 0;
    const rows = faileds
        .filter(({ issues }) => issues.some(({ status }) => status === 'IMG_404'))
        .map(({ id, name, anatomicalRegion, procedure, classification, manufacturer, details , issues }, index: number) => {
            const { message } = issues.find(({ status }) => status === 'IMG_404')!;
            totalImages = totalImages + details.length;
            return { id, name, anatomicalRegion, procedure, classification, manufacturer, message, argb: index % 2 === 0 ? evenFill : oddFill }
        });
    for (const row of rows) {
        const { argb } = row;
        const addedRow = sheet.addRow(row);
        addedRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb } };
        addedRow.border = rowBorder;
    }
    return { imagesImplants: rows.length, totalImages };
}
function createTotalReportSheet(workbook: ExcelJS.Workbook, total: number, notFoundTemplate: number, emptyProperties: number, imagesImplants: number, totalImages: number, images: number) {
    const sheet = workbook.addWorksheet('Total report');
    sheet.columns = [
        { header: '', key: 'name', width: 40 },
        { header: '', key: 'value', width: 12 },
        { header: '', key: 'total', width: 12 },
    ];
    sheet.addRow({ name: 'Templates checked', value: total });
    sheet.addRow({ name: 'Not Found Templates', value: notFoundTemplate, total });
    sheet.addRow({ name: 'Empty Templates', value: emptyProperties, total: total - notFoundTemplate });
    sheet.addRow({ name: 'Not Found Image Templates', value: imagesImplants, total: total - notFoundTemplate });
    sheet.addRow({ name: 'Not Found Images', value: totalImages, total: images });
}
async function getExcel(faileds: ITemplate[], total: number, images: number): Promise<ArrayBuffer> {
    const workbook = new ExcelJS.Workbook();
    const notFoundTemplate = createNotFoundTemplateSheet(workbook, faileds);
    createEmptyPropertiesSheet(workbook, faileds);
    createNotFoundImageSheet(workbook, faileds);
    // Totals
    const emptyProperties = createEmptyPropertiesTotalSheet(workbook, faileds);
    const { imagesImplants, totalImages } = createNotFoundImageTotalSheet(workbook, faileds);
    createTotalReportSheet(workbook, total, notFoundTemplate, emptyProperties, imagesImplants, totalImages, images);
    return workbook.xlsx.writeBuffer();
}
export async function viewExcel(faileds: ITemplate[], total: number, images: number) {
    const buffer = await getExcel(faileds, total, images);
    (globalThis as any).electronAPI.openExcel(buffer);
}
export async function saveExcel(faileds: ITemplate[], total: number, images: number) {
    const buffer = await getExcel(faileds, total, images);
    (globalThis as any).electronAPI.saveExcel(buffer);
}
