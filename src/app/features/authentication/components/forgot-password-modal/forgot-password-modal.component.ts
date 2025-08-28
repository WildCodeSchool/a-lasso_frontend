import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthFacade } from '../../services/auth-facade.service';
import { DialogModule } from 'primeng/dialog';
import { FormField } from '../../models/form.model';
import { InputFieldComponent } from 'src/app/common/components/input-field/input-field.component';
import { InputFieldErrorComponent } from 'src/app/common/components/input-field-error/input-field-error.component';

@Component({
  selector: 'app-forgot-password-modal',
  imports: [DialogModule, FormsModule, ReactiveFormsModule, InputFieldComponent, InputFieldErrorComponent],
  templateUrl: './forgot-password-modal.component.html',
  styleUrl: './forgot-password-modal.component.scss',
})
export class ForgotPasswordModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() closeLoginModal = new EventEmitter<boolean>();

  private _auth = inject(AuthFacade);
  private _fb = inject(FormBuilder);

  forgotPasswordForm = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  emailField: FormField = { name: 'email', label: 'E-mail', type: 'email', required: true };

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) return;
    this._auth.resetPasswordRequest(this.forgotPasswordForm.value.email);

    this.visibleChange.emit(false);
    this.closeLoginModal.emit(true);
  }

  onDialogHide(): void {
    this.resetForm();
    this.visibleChange.emit(false);
  }

  resetForm(): void {
    this.forgotPasswordForm.reset();
  }
}
