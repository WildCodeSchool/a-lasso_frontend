import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { TextareaModule } from 'primeng/textarea';
import { FormField } from 'src/app/features/authentication/models/form.model';
import { InputFieldErrorComponent } from '../input-field-error/input-field-error.component';
import { NgClass } from '@angular/common';

const DEFAULT_ROWS: number = 5;
const DEFAULT_COLS: number = 30;

@Component({
  selector: 'app-textarea-field',
  standalone: true,
  imports: [FormsModule, TextareaModule, IftaLabelModule, ReactiveFormsModule, InputFieldErrorComponent, NgClass],
  templateUrl: './textarea-field.component.html',
  styleUrl: './textarea-field.component.scss',
})
export class TextareaFieldComponent {
  @Output() save = new EventEmitter<void>();

  @Input() submitted!: boolean;
  @Input() showSaveButton = false;
  @Input() disabled: boolean = false;
  @Input() rows: number = DEFAULT_ROWS;
  @Input() cols: number = DEFAULT_COLS;
  @Input() id: string = 'textarea-field';
  @Input({ required: true }) maxlength!: number;
  @Input({ required: true }) fieldConfig!: FormField;
  @Input({ required: true }) formGroup: FormGroup;

  get fieldContentLength(): number {
    const control = this.formGroup.get(this.fieldConfig.name);
    return control?.value?.length || 0;
  }
}
