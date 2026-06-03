import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { AccordionModule } from 'primeng/accordion';
import { TabsModule } from 'primeng/tabs';
import { CarouselModule } from 'primeng/carousel';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ContextMenuModule } from 'primeng/contextmenu';
import { PopoverModule } from 'primeng/popover';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
//
// import { SelectDirective } from './directives/select.directive';
// import { MultiSelectDirective } from './directives/multi-select.directive';
// import { TooltipDirective } from './directives/tooltip.directive';
//

const modules = [
    CommonModule, FormsModule,
    //
    IconFieldModule, InputIconModule, InputMaskModule,
    InputTextModule, InputNumberModule, TextareaModule,
    SelectModule, MultiSelectModule, DatePickerModule,
    CheckboxModule, RadioButtonModule,
    ButtonModule, SelectButtonModule, ToggleSwitchModule,
    AccordionModule, TabsModule, CarouselModule, TableModule, ProgressSpinnerModule,
    MenuModule, PanelMenuModule, ContextMenuModule,
    DialogModule, ConfirmDialogModule, DynamicDialogModule, PopoverModule,
    ColorPickerModule, ToastModule, TooltipModule,
    //
    // SelectDirective, MultiSelectDirective, TooltipDirective,
];

@NgModule({
    imports: [...modules],
    exports: [...modules],
})
export class SharedModule { }
