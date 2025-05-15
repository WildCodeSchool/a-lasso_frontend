import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { AssociationRegister, UserType, VoluntaryRegister } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { RegisterAssociationFormComponent } from '../register-association-form/register-association-form.component';
import { RegisterVoluntaryFormComponent } from '../register-voluntary-form/register-voluntary-form.component';
import { DATE_PAD_LENGTH, MONTH_OFFSET } from '../../../constants/form.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getFormattedAddress } from 'src/app/common/utils/address.utils';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, Select, RegisterVoluntaryFormComponent, RegisterAssociationFormComponent, FormsModule],
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
})
export class RegisterModalComponent {
  private _authService = inject(AuthService);
  private _destroyRef = inject(DestroyRef);
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() visible = false;
  @ViewChild(RegisterVoluntaryFormComponent) voluntaryFormComponent!: RegisterVoluntaryFormComponent;
  @ViewChild(RegisterAssociationFormComponent) associationFormComponent!: RegisterAssociationFormComponent;

  userType: UserType = UserType.Voluntary;
  userTypeOptions = [
    { label: 'Bénévole', value: UserType.Voluntary },
    { label: 'Association', value: UserType.Association },
  ];

  hideModal(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    if (this.userType === UserType.Voluntary) {
      this.voluntaryFormComponent?.resetForm();
    } else {
      this.associationFormComponent?.resetForm();
    }
    this.userType = UserType.Voluntary;
  }

  onRegisterVoluntary(form: FormGroup): void {
    const value = form.value;
    const data: VoluntaryRegister = {
      first_name: value.first_name,
      last_name: value.last_name,
      email: value.email,
      password: value.password,
      mobile_phone: value.phone || '',
      city: value.city,
      country: value.country,
      birth_date: this._formatDate(value.birthdate),
    };

    this._authService
      .registerVoluntary(data)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((success: boolean) => {
        if (success) this.hideModal();
      });
  }

  onRegisterAssociation(form: FormGroup): void {
    const value = form.value;
    const data: AssociationRegister = {
      siret: value.siret,
      name: value.name,
      email: value.email,
      password: value.password,
      mobile_phone: value.phone,
      address: getFormattedAddress(value.address),
    };

    this._authService
      .registerAssociation(data)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((success: boolean) => {
        if (success) this.hideModal();
      });
  }

  private _formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + MONTH_OFFSET).padStart(DATE_PAD_LENGTH, '0');
    const day = String(date.getDate()).padStart(DATE_PAD_LENGTH, '0');
    return `${year}-${month}-${day}`;
  }
}
