import { Component, input, linkedSignal, inject } from '@angular/core';
import { form, FormField, required, readonly, validate } from '@angular/forms/signals';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedModule } from '@shared-module';
import { IConfigurations } from '../templates.interface';
import { isEqual } from 'lodash';

@Component({
    selector: 'test-configurations',
    imports: [SharedModule, FormField],
    templateUrl: './test-configurations.html',
    styleUrl: './test-configurations.scss',
    host: { class: 'flex flex-column gap-4' },
})
export class TestConfigurations {
    readonly _dialogRef = inject(DynamicDialogRef);
    readonly vmodel = input.required<IConfigurations>();
    readonly options = input.required<{ procedures: string[]; anatomicalRegions: string[]; }>();
    readonly proceduresOptions = linkedSignal<string[]>(() => this.options().procedures);
    readonly anatomicalRegionsOptions = linkedSignal<string[]>(() => this.options().anatomicalRegions);
    readonly formModel = linkedSignal<IConfigurations>(() => this.vmodel());
    readonly formGroup = form<IConfigurations>(this.formModel, (schema) => {
        validate(schema, ({ value }) => {
            return isEqual(value(), this.vmodel()) ? { kind: 'unchanged', message: 'Unchanged' } : null;
        });
    });
    addOtherProcedure(inputElement: HTMLInputElement) {
        const value = inputElement.value.charAt(0).toUpperCase() + inputElement.value.slice(1);
        if (!this.proceduresOptions().includes(value)) {
            this.proceduresOptions.update(
                current => ([...current, value])
            );
            this.formModel.update(
                current => ({
                    ...current, procedures: [...current.procedures, value]
                })
            );
        }
        inputElement.value = '';
    }
    addOtherAnatomicalRegion(inputElement: HTMLInputElement) {
        const value = inputElement.value.charAt(0).toUpperCase() + inputElement.value.slice(1);
        if (!this.anatomicalRegionsOptions().includes(value)) {
            this.anatomicalRegionsOptions.update(
                current => ([...current, value])
            );
            this.formModel.update(
                current => ({
                    ...current, anatomicalRegions: [...current.anatomicalRegions, value]
                })
            );
        }
        inputElement.value = '';
    }
    onSubmit() {
        this._dialogRef.close(structuredClone(this.formModel()));
    }
    onCancel() {
        this._dialogRef.close();
    }
}
