import { ITemplate, ITemplateDetail } from '../templates.interface';

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
            const issue = template.issues.find(({ status }) => status === 'EMPT_PROPS');
            if (issue) {
                const { message } = issue;
                return {
                    ...template, message,
                    details: template.details
                        .filter(({ status }) => status === 'EMPT_PROPS')
                        .sort((a: ITemplateDetail, b: ITemplateDetail) => {
                            return a.index - b.index
                        })
                }
            }
            return undefined as unknown as ITemplate;
        })
        .filter(Boolean);
}
export function vmImages(faileds: ITemplate[]) {
    return faileds
        .map((template) => {
            const issue = template.issues.find(({ status }) => status === 'IMG_404');
            if (issue) {
                const { message } = issue;
                return {
                    ...template, message,
                    details: template.details
                        .filter(({ status }) => status === 'IMG_404')
                        .sort((a: ITemplateDetail, b: ITemplateDetail) => {
                            if (a.index === b.index) {
                                return Number.parseInt(a.ImageID!) - Number.parseInt(b.ImageID!);
                            }
                            return a.index - b.index
                        })
                }
            }
            return undefined as unknown as ITemplate;
        })
        .filter(Boolean);
}
