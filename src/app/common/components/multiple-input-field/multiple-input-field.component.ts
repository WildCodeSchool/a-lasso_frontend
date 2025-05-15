import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { FormField } from 'src/app/features/authentication/models/form.model';

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
  ],
  templateUrl: './multiple-input-field.component.html',
  styleUrls: ['./multiple-input-field.component.scss'],
})
export class MultipleInputFieldComponent implements OnChanges {
  @Output() inputValuesChanged = new EventEmitter<Record<string, string>>();
  @Input() fieldConfigs: FormField[] = [];
  @Input() showSearchButton: boolean = false;
  @Input() formGroup: FormGroup;

  focusedIndex: number | null = null;
  inputConfigs: { name: string; label: string; placeholder: string; type: string; value: string }[] = [];

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
      filters[config.name] = config.value;
    });
    this.inputValuesChanged.emit(filters);
  }

  clearInput(index: number): void {
    this.inputConfigs[index].value = '';
    this.emitValues();
  }
}
