import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-input-field-error',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-field-error.component.html',
  styleUrls: ['./input-field-error.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, maxHeight: 0, transform: 'translateY(-5px)' }),
        animate('300ms ease-out', style({ opacity: 1, maxHeight: 200, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, maxHeight: 200, transform: 'translateY(0)' }),
        animate('300ms ease-in', style({ opacity: 0, maxHeight: 0, transform: 'translateY(-5px)' })),
      ]),
    ]),
  ],
})
export class InputFieldErrorComponent {
  @Input() control!: AbstractControl | null;
  @Input() fieldName = '';
  @Input() showPasswordMismatchError = false;
  @Input() globalError: string | null = null;
}
