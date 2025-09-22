import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { TextareaModule } from 'primeng/textarea';
import { FormField } from 'src/app/features/authentication/models/form.model';
import { AutosaveFieldComponent } from '../../directives/autosave-field.component';
import { SaveStatus } from '../../models/status';
import { InputFieldErrorComponent } from '../input-field-error/input-field-error.component';

const DEFAULT_ROWS = 5;
const DEFAULT_COLS = 30;

@Component({
  selector: 'app-textarea-field',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IftaLabelModule, TextareaModule, InputFieldErrorComponent],
  templateUrl: './textarea-field.component.html',
  styleUrls: ['./textarea-field.component.scss'],
})
export class TextareaFieldComponent extends AutosaveFieldComponent<string> {
  @Output() save = new EventEmitter<string>();

  @Input() submitted!: boolean;
  @Input() showSaveButton = false;
  @Input() disabled = false;
  @Input() rows: number = DEFAULT_ROWS;
  @Input() cols: number = DEFAULT_COLS;
  @Input() id: string = 'textarea-field';
  @Input() override autosave = false;
  @Input({ required: true }) maxlength!: number;
  @Input({ required: true }) fieldConfig!: FormField;
  @Input({ required: true }) formGroup!: FormGroup;

  override saveStatus: SaveStatus = 'idle';

  override ngOnInit(): void {
    super.ngOnInit();
    const control = this.formGroup.get(this.fieldConfig.name);
    control?.valueChanges.subscribe(val => this.valueChanges$.next(val));
  }

  manualSave(): void {
    const value = this.formGroup.get(this.fieldConfig.name)?.value;
    this.startSaving();
    this.save.emit(value);
  }

  protected override onSave(value: string): void {
    this.save.emit(value);
  }

  get fieldContentLength(): number {
    const control = this.formGroup.get(this.fieldConfig.name);
    return control?.value?.length || 0;
  }
}
