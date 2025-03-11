import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, InputTextModule, FloatLabelModule, CalendarModule, FormsModule, PasswordModule, DividerModule],
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
})
export class InputFieldComponent {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() disabled: boolean = false;
  @Input() variant: 'in' | 'on' = 'in';
  @Input() showPasswordRules: boolean = false;
  value: string = '';
}
