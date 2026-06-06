import { Signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IToastMessage, IConfirmDialog } from '@interfaces';

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
    readonly confirmationService: ConfirmationService;
    readonly messageService: MessageService;
}
let ctx!: IContext;
export function initAppStoreHelperContext(context: IContext) {
    ctx = context;
}
export function showToastMessages(messages: IToastMessage[]) {
    for (const { detail, severity, life, styleClass } of messages) {
        ctx.messageService.add({
            detail: detail ?? '',
            life: life ?? 6 * 1000,
            severity: severity ?? 'info',
            styleClass: styleClass ?? ''
        });
    }
}
export function showConfirmDialog() {}
export function copyToClipboard(copy: string, detail: string) {
    navigator
        .clipboard.writeText(copy)
        .then(() => showToastMessages([{
            detail: `"${detail}" was copied to clipboard`, severity: 'success'
        }]));
}
export function stopPropagation(event: Event) {
    event.stopPropagation();
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}
