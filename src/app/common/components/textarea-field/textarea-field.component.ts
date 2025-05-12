import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { TextareaModule } from 'primeng/textarea';
import { Subject } from 'rxjs';

export const DEFAULT_ROWS: number = 5;
export const DEFAULT_COLS: number = 30;

@Component({
  selector: 'app-textarea-field',
  standalone: true,
  imports: [FormsModule, TextareaModule, IftaLabelModule, ReactiveFormsModule],
  templateUrl: './textarea-field.component.html',
  styleUrl: './textarea-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaFieldComponent),
      multi: true,
    },
  ],
})
export class TextareaFieldComponent implements ControlValueAccessor, OnDestroy {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() rows: number = DEFAULT_ROWS;
  @Input() cols: number = DEFAULT_COLS;
  @Input() id: string = 'textarea-field';
  @Input() formControlName!: string;

  value: string = '';
  private _destroy$ = new Subject<void>();

  onChange = (value: string): void => {
    this.value = value;
  };

  onTouched = (): void => {
    /* */
  };

  updateValue(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const value = target.value;
    this.value = value;
    this.onChange(value);
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
