export interface ICurrentState {
    readonly state: string;
    readonly header: string;
};
export interface IConfirmDialog {
    header: string;
    message: string;
    accept?: {
        label?: string;
        action?: (...args: any) => void;
    };
    reject?: {
        label?: string;
        action?: (...args: any) => void;
    };
    key?: string;
    acceptButtonStyleClass?: string;
    rejectButtonStyleClass?: string;
}
export interface IToastMessage {
    detail: string;
    life: number;
    severity: string;
    styleClass: string;
}
