import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormField } from 'src/app/features/authentication/models/form.model';
import { updateDateLimits } from '../../utils/date.utils';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    FloatLabelModule,
    IftaLabelModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    DividerModule,
  ],
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
})
export class InputFieldComponent implements OnInit {
  @Input() submitted: boolean = true;
  @Input() disabled: boolean = false;
  @Input() variant: 'in' | 'on' = 'in';
  @Input() useIftaLabel: boolean = false;
  @Input() showPasswordRules: boolean = false;

  @Input({ required: true }) fieldConfig!: FormField;
  @Input({ required: true }) formGroup: FormGroup;
  @Input() dateMode: 'future' | 'past' | 'all' = 'all';

  minDate: Date | undefined;
  maxDate: Date | undefined;

  ngOnInit(): void {
    const { maxDate, minDate } = updateDateLimits(this.dateMode);
    this.maxDate = maxDate;
    this.minDate = minDate;
  }

  get inputId(): string {
    return 'input_' + this.fieldConfig.name;
  }

  get inputType(): string {
    return this.fieldConfig.type || 'text';
  }
}
