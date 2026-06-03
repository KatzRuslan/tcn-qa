import { ITemplate } from '../templates.interface';

export function vmNotfounds(faileds: ITemplate[]) {
    return faileds
        .map((template) => {
            const details = template.issues.find(({ status }) => status === '404');
            if (details) {
                const { message } = details;
                return { ...template, message }
            }
            return undefined as unknown as ITemplate;
        })
        .filter(Boolean);
}
export function vmNoProperies(faileds: ITemplate[]) {
    return faileds
        .map((template) => {
            const details = template.issues.find(({ status }) => status === 'EMPT_PROPS');
            if (details) {
                const { message } = details;
                return { ...template, message }
            }
            return undefined as unknown as ITemplate;
        })
        .filter(Boolean);
}
export function vmImages(faileds: ITemplate[]) {
    return faileds
        .map((template) => {
            const details = template.issues.find(({ status }) => status === 'IMG_404');
            if (details) {
                const { message } = details;
                return { ...template, message }
            }
            return undefined as unknown as ITemplate;
        })
        .filter(Boolean);
}
