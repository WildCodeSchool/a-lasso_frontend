import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { FormField } from 'src/app/features/authentication/models/form.model';
import { AutosaveFieldComponent } from '../../directives/autosave-field.component';
import { SaveStatus } from '../../models/status';
import { InputFieldErrorComponent } from '../input-field-error/input-field-error.component';

@Component({
  selector: 'app-multiple-input-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IftaLabelModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    CalendarModule,
    InputFieldErrorComponent,
  ],
  templateUrl: './multiple-input-field.component.html',
  styleUrls: ['./multiple-input-field.component.scss'],
})
export class MultipleInputFieldComponent extends AutosaveFieldComponent<Record<string, string>> implements OnChanges {
  @Output() inputValuesChanged = new EventEmitter<Record<string, string>>();
  @Output() save = new EventEmitter<Record<string, string>>();

  @Input() fieldConfigs: FormField[] = [];
  @Input() showSearchButton = false;
  @Input() showSaveButton = false;
  @Input() showErrors = false;
  @Input() formGroup!: FormGroup;
  @Input() override autosave = false;

  focusedIndex: number | null = null;
  inputConfigs: { name: string; label: string; placeholder: string; type: string; value: string }[] = [];

  override saveStatus: SaveStatus = 'idle';

  get inputClass(): Record<string, boolean> {
    return {
      'with-search': this.showSearchButton,
      'without-search': !this.showSearchButton,
    };
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fieldConfigs']) {
      this.inputConfigs = this.fieldConfigs.map(config => ({
        name: config.name,
        label: config.label,
        placeholder: config.placeholder ?? '',
        type: config.type ?? 'text',
        value: '',
      }));
    }
  }

  emitValues(): void {
    const filters: Record<string, string> = {};
    this.inputConfigs.forEach(config => {
      filters[config.name] = this.formGroup.get(config.name)?.value || '';
    });
    this.valueChanges$.next(filters);
    this.inputValuesChanged.emit(filters);
  }

  manualSave(): void {
    const values: Record<string, string> = {};
    this.inputConfigs.forEach(config => {
      values[config.name] = this.formGroup.get(config.name)?.value || '';
    });
    this.startSaving();
    this.onSave(values);
  }

  clearInput(index: number): void {
    this.inputConfigs[index].value = '';
    this.emitValues();
  }

  protected override onSave(values: Record<string, string>): void {
    this.save.emit(values);
  }
}
