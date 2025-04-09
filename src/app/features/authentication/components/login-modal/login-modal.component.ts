import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputFieldComponent } from 'src/app/common/components/input-field/input-field.component';
import { AuthService } from '../../services/auth.service';
import { FormField } from '../../models/form.model';
import { UserLogin } from '../../models/user.model';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputFieldComponent, ButtonModule, DialogModule, RadioButtonModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss',
})
export class LoginModalComponent {
  private _authService: AuthService = inject(AuthService);
  private _fb: FormBuilder = new FormBuilder();
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  loginForm = this._fb.group({
    email: [''],
    password: [''],
  });

  loginFields: FormField[] = [
    { name: 'email', label: 'E-mail', type: 'email', required: true },
    { name: 'password', label: 'Mot de passe', type: 'password', required: true },
  ];

  showModal(): void {
    this.visible = true;
  }

  hideModal(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForms();
  }

  resetForms(): void {
    this.loginForm.reset();
  }

  onSubmit(): void {
    this._authService.clearToken();
    this._authService.login(this.loginForm.value as UserLogin).subscribe(token => {
      this._authService.saveToken(token);
      this.hideModal();
    });
  }
}
