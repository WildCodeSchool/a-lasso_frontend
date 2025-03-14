import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Select } from 'primeng/select';
import { InputFieldComponent } from 'src/app/common/components/input-field/input-field.component';
import { FormField } from '../../models/form.model';
import { AssociationRegister, UserType, VoluntaryRegister } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputFieldComponent, ButtonModule, DialogModule, RadioButtonModule, Select],
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
})
export class RegisterModalComponent implements OnInit {
  private _authService: AuthService = inject(AuthService);
  private _fb: FormBuilder = new FormBuilder();
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  userType: UserType = 'bénévole';
  userTypeOptions: { label: string; value: UserType }[] = [];
  benevoleForm: FormGroup = this._fb.group({
    nom: [''],
    prenom: [''],
    email: [''],
    motDePasse: [''],
    confirmationMotDePasse: [''],
    telephone: [''],
    ville: [''],
    pays: [''],
    dateNaissance: [''],
  });

  associationForm: FormGroup = this._fb.group({
    siret: [''],
    nom: [''],
    telephone: [''],
    adresseNumero: [''],
    adresseRue: [''],
    adresseComplement: [''],
    adresseCodePostal: [''],
    adresseVille: [''],
    adressePays: [''],
    email: [''],
    motDePasse: [''],
    confirmationMotDePasse: [''],
  });

  benevoleFields: FormField[] = [
    { name: 'prenom', label: 'Prénom', type: 'text', required: true },
    { name: 'nom', label: 'Nom', type: 'text', required: true },
    { name: 'email', label: 'E-mail', type: 'email', required: true },
    { name: 'motDePasse', label: 'Mot de passe', type: 'password', required: true, showPasswordRules: true },
    { name: 'confirmationMotDePasse', label: 'Vérification du mot de passe', type: 'password', required: true },
    { name: 'telephone', label: 'Téléphone (optionnel)', type: 'tel' },
    { name: 'ville', label: 'Ville', type: 'text', required: true },
    { name: 'pays', label: 'Pays', type: 'text', required: true },
    { name: 'dateNaissance', label: 'Date de naissance', type: 'date', required: true },
  ];

  associationFields: FormField[] = [
    { name: 'siret', label: 'N° SIRET', type: 'text', required: true },
    { name: 'nom', label: 'Nom', type: 'text', required: true },
    { name: 'telephone', label: 'Téléphone', type: 'tel', required: true },
  ];

  addressFields: FormField[] = [
    { name: 'adresseNumero', label: 'Numéro', type: 'text' },
    { name: 'adresseRue', label: 'Rue', type: 'text', required: true },
    { name: 'adresseComplement', label: 'Complément', type: 'text' },
    { name: 'adresseCodePostal', label: 'Code Postal', type: 'text', required: true },
    { name: 'adresseVille', label: 'Ville', type: 'text', required: true },
    { name: 'adressePays', label: 'Pays', type: 'text', required: true },
  ];

  associationAuthFields: FormField[] = [
    { name: 'email', label: 'E-mail', type: 'email', required: true },
    { name: 'motDePasse', label: 'Mot de passe', type: 'password', required: true, showPasswordRules: true },
    { name: 'confirmationMotDePasse', label: 'Vérification du mot de passe', type: 'password', required: true },
  ];

  ngOnInit(): void {
    this.userTypeOptions = [
      { label: 'Bénévole', value: 'bénévole' },
      { label: 'Association', value: 'association' },
    ];
  }

  hideModal(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForms();
  }

  resetForms(): void {
    this.benevoleForm.reset({
      pays: '',
    });
    this.associationForm.reset({
      adressePays: '',
    });
  }

  onSubmit(): void {
    const currentForm = this.userType === 'bénévole' ? this.benevoleForm : this.associationForm;

    if (currentForm.get('motDePasse')?.value !== currentForm.get('confirmationMotDePasse')?.value) {
      return;
    }

    if (this.userType === 'bénévole') {
      this._registerVoluntary();
    } else {
      this._registerAssociation();
    }

    console.log('Inscription:', currentForm.value);
  }

  private _registerVoluntary(): void {
    const formData = this.benevoleForm.value;

    const voluntaryData: VoluntaryRegister = {
      first_name: formData.prenom,
      last_name: formData.nom,
      email: formData.email,
      password: formData.motDePasse,
      mobile_phone: formData.telephone || '',
      city: formData.ville,
      country: formData.pays,
      birth_date: formData.dateNaissance,
    };

    this._authService.registerVoluntary(voluntaryData).subscribe({
      next: (success: boolean) => {
        if (success) {
          this.hideModal();
        }
      },
    });
  }

  private _registerAssociation(): void {
    const formData = this.associationForm.value;

    const associationData: AssociationRegister = {
      siret: formData.siret,
      name: formData.nom,
      email: formData.email,
      password: formData.motDePasse,
      mobile_phone: formData.telephone,
      address: {
        house_number: formData.adresseNumero || '',
        street_name: formData.adresseRue,
        adress_suffix: formData.adresseComplement || '',
        zipCode: formData.adresseCodePostal,
        city: formData.adresseVille,
        country: formData.adressePays,
      },
    };

    this._authService.registerAssociation(associationData).subscribe({
      next: success => {
        if (success) {
          this.hideModal();
        }
      },
    });
  }

  changeUserType(type: UserType): void {
    this.userType = type;
  }
}
