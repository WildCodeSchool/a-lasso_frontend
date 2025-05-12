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
  @Input() label: string | undefined = '';
  @Input() type: string = 'text';
  @Input() disabled: boolean = false;
  @Input() variant: 'in' | 'on' = 'in';
  @Input() showPasswordRules: boolean = false;
  @Input() formControlName?: string;

  value: string = '';
  private _destroy$ = new Subject<void>();

  onChange = (value: string): void => {
    this.value = value;
  };

  onTouched = (): void => {
    /* */
  };

  updateValue(val: string): void {
    this.onChange(val);
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(onChangeFunction: (value: string) => void): void {
    this.onChange = onChangeFunction;
  }

  registerOnTouched(onTouchedFunction: () => void): void {
    this.onTouched = onTouchedFunction;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
