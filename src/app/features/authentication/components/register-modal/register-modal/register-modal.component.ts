import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { AssociationRegister, UserType, VoluntaryRegister } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { RegisterAssociationFormComponent } from '../register-association-form/register-association-form.component';
import { RegisterVoluntaryFormComponent } from '../register-voluntary-form/register-voluntary-form.component';
import { DATE_PAD_LENGTH, MONTH_OFFSET } from '../../../constants/form.constants';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, Select, RegisterVoluntaryFormComponent, RegisterAssociationFormComponent, FormsModule],
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
})
export class RegisterModalComponent {
  private _authService = inject(AuthService);

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @ViewChild(RegisterVoluntaryFormComponent) voluntaryFormComponent!: RegisterVoluntaryFormComponent;
  @ViewChild(RegisterAssociationFormComponent) associationFormComponent!: RegisterAssociationFormComponent;

  userType: UserType = 'bénévole';
  userTypeOptions = [
    { label: 'Bénévole', value: 'bénévole' },
    { label: 'Association', value: 'association' },
  ];

  hideModal(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    if (this.userType === 'bénévole') {
      this.voluntaryFormComponent?.resetForm();
    } else {
      this.associationFormComponent?.resetForm();
    }
    this.userType = 'bénévole';
  }

  onRegisterVoluntary(form: FormGroup): void {
    const value = form.value;
    const data: VoluntaryRegister = {
      first_name: value.prenom,
      last_name: value.nom,
      email: value.email,
      password: value.motDePasse,
      mobile_phone: value.telephone || '',
      city: value.ville,
      country: value.pays,
      birth_date: this._formatDate(value.dateNaissance),
    };

    this._authService.registerVoluntary(data).subscribe((success: boolean) => {
      if (success) this.hideModal();
    });
  }

  onRegisterAssociation(form: FormGroup): void {
    const value = form.value;
    const data: AssociationRegister = {
      siret: value.siret,
      name: value.nom,
      email: value.email,
      password: value.motDePasse,
      mobile_phone: value.telephone,
      address: {
        house_number: value.adresseNumero || '',
        street_name: value.adresseRue,
        adress_suffix: value.adresseComplement || null,
        zipCode: value.adresseCodePostal,
        city: value.adresseVille,
        country: value.adressePays,
      },
    };

    this._authService.registerAssociation(data).subscribe((success: boolean) => {
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
