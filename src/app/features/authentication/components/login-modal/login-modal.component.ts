import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { combineLatest, filter, take } from 'rxjs';
import { InputFieldComponent } from 'src/app/common/components/input-field/input-field.component';
import { TAKE_1 } from 'src/app/common/constants/observables.constants';
import { InputFieldErrorComponent } from 'src/app/common/components/input-field-error/input-field-error.component';
import { AuthFacade } from '../../services/auth-facade.service';
import { FormField } from '../../models/form.model';
import { UserLogin } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputFieldComponent,
    ButtonModule,
    DialogModule,
    RadioButtonModule,
    InputFieldErrorComponent,
  ],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-5px)', maxHeight: 0 }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)', maxHeight: 200 })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0)', maxHeight: 200 }),
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-5px)', maxHeight: 0 })),
      ]),
    ]),
  ],
})
export class LoginModalComponent implements OnChanges {
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() openPasswordForgottenModal = new EventEmitter<boolean>();

  @Input() email: string = '';
  @Input() visible: boolean = false;
  private _authFacade = inject(AuthFacade);
  private _authService = inject(AuthService);
  private _fb: FormBuilder = new FormBuilder();
  isAuthenticated$ = this._authFacade.isAuthenticated$;
  isBanned$ = this._authService.isbanned$;
  openForgotPasswordModal = false;

  loginForm = this._fb.group({
    email: [this.email, [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  loginFields: FormField[] = [
    { name: 'email', label: 'E-mail', type: 'email', required: true },
    { name: 'password', label: 'Mot de passe', type: 'password', required: true },
  ];

  error: string = '';
  submitted = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['email'] && changes['email'].currentValue !== undefined) {
      this.loginForm.get('email')?.setValue(changes['email'].currentValue);
    }
  }

  showModal(): void {
    this.visible = true;
    this.error = '';
  }

  hideModal(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForms();
    this.openForgotPasswordModal = false;
  }

  resetForms(): void {
    this.loginForm.reset();
    this.error = '';
    this.submitted = false;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.error = 'Veuillez remplir tous les champs obligatoires avec des informations valides.';
      return;
    }

    const credentials = this.loginForm.value as UserLogin;
    this._authFacade.login(credentials);

    combineLatest([
      this._authFacade.isAuthenticated$.pipe(
        filter(isAuth => isAuth),
        take(TAKE_1)
      ),
      this.isBanned$.pipe(take(TAKE_1)),
    ]).subscribe(([isAuth, isBanned]) => {
      if (isAuth) {
        this.hideModal();
        this.error = null;
      } else if (isBanned) {
        this.error = 'Trop de tentatives échouées. Veuillez réessayer plus tard.';
      } else {
        this.error = 'Informations invalides. Veuillez réessayer.';
      }
    });
  }

  onForgotPassword(): void {
    this.openPasswordForgottenModal.emit(true);
  }

  onNoAccount(): void {
    this._authService.triggerSubscribeModal();
  }
}
