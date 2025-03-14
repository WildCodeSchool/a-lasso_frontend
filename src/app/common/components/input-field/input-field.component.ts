import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, InputTextModule, FloatLabelModule, CalendarModule, FormsModule, ReactiveFormsModule, PasswordModule, DividerModule],
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true,
    },
  ],
})
export class InputFieldComponent implements ControlValueAccessor, OnDestroy {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() disabled: boolean = false;
  @Input() variant: 'in' | 'on' = 'in';
  @Input() showPasswordRules: boolean = false;
  @Input() formControlName?: string;

  value: any = '';
  private _destroy$ = new Subject<void>();

  onChange = (value: any): void => {
    console.log('onChange appelé avec', value);
  };

  onTouched = (): void => {
    /* */
  };

  get valueAccessor(): string {
    return this.onChange.toString().slice(0, 100);
  }

  updateValue(val: any): void {
    this.value = val;
    this.onChange(val);
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
