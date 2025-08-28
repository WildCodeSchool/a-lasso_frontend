import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, debounceTime } from 'rxjs';
import { FormField } from 'src/app/features/authentication/models/form.model';
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
export class MultipleInputFieldComponent implements OnChanges {
  @Output() inputValuesChanged = new EventEmitter<Record<string, string>>();
  @Output() save = new EventEmitter<void>();

  @Input() fieldConfigs: FormField[] = [];
  @Input() showSearchButton: boolean = false;
  @Input() showSaveButton = false;
  @Input() showErrors = false;
  @Input() formGroup: FormGroup;

  focusedIndex: number | null = null;
  inputConfigs: { name: string; label: string; placeholder: string; type: string; value: string }[] = [];

  private _inputChanges$ = new Subject<Record<string, string>>();

  get inputClass(): Record<string, boolean> {
    return {
      'with-search': this.showSearchButton,
      'without-search': !this.showSearchButton,
    };
  }

  constructor() {
    this._inputChanges$.pipe(debounceTime(500)).subscribe(filters => {
      this.inputValuesChanged.emit(filters);
    });
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
      filters[config.name] = config.value;
    });
    this._inputChanges$.next(filters);
  }

  clearInput(index: number): void {
    this.inputConfigs[index].value = '';
    this.emitValues();
  }
}
