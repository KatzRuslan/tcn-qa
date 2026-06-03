export interface ITemplate {
    readonly id: string;
    readonly name: string;
    readonly manufacturer: string;
    readonly classification: string;
    readonly procedure: string;
    readonly anatomicalRegion: string;
    readonly implants: ITemplateImplant[];
    readonly possibleValues: IPossibleValues;
    readonly mainImplant: boolean;
    readonly mainSizeField: string;
    readonly details: {
        readonly status: string;
        readonly message: string;
    }[];
}
export interface IPossibleValues {
    readonly [key: string]: {
        readonly propertyName: string;
        readonly valuesList: {
            readonly value: string;
            readonly displayOrder: number;
        }[];
    };
}
export interface ITemplateImplant {
    readonly id: string;
    readonly familyId: string;
    readonly payload: ITemplatePayload;
}
export interface ITemplatePayload {
    readonly partNumber: string;
    readonly bodySide: string;
    readonly images: {
        readonly view: string;
        readonly ImageID: string;
        readonly startPoint: IPoint;
        readonly originPoint: IPoint;
        readonly imageSide: string;
        readonly imageLocation: string;
        readonly details: {
            readonly name: string;
            readonly value: string;
        }[];
    }[];
    readonly properties: {
        readonly propertyName: string;
        readonly propertyValue: string;
    }[];
}
export interface IPoint {
    readonly x: number | string;
    readonly y: number | string;
}
