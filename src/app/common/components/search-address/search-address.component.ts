import { Component, Input, OnInit, inject } from '@angular/core';
import { debounceTime, Observable, of, startWith, switchMap } from 'rxjs';
import { ActivityFacadeService } from '../../../features/activity/services/activity-facade.service';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputFieldErrorComponent } from 'src/app/common/components/input-field-error/input-field-error.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AddressApiResult } from '../../../features/authentication/models/user.model';
import { FormField } from '../../../features/authentication/models/form.model';
import { DestroyableComponent } from '../../utils/DestroyableComponent';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-search-address',
  templateUrl: './search-address.component.html',
  styleUrl: './search-address.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    SelectModule,
    InputGroupModule,
    AutoCompleteModule,
    FloatLabelModule,
    InputFieldErrorComponent,
    ReactiveFormsModule,
    AsyncPipe,
  ],
})
export class SearchAddressComponent extends DestroyableComponent implements OnInit {
  private _activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);
  @Input() formGroup?: FormGroup;
  @Input({ required: true }) fieldConfig: FormField;

  searchAddressResults$!: Observable<AddressApiResult[] | null>;

  ngOnInit(): void {
    if (!this.formGroup || !this.fieldConfig) return;

    this._initAddressAutocomplete();
  }

  private _initAddressAutocomplete(): void {
    const control = this.formGroup!.get(this.fieldConfig.name);
    if (!control) return;

    this.searchAddressResults$ = control.valueChanges.pipe(
      startWith(''),
      debounceTime(600),
      switchMap((query: string) => this._handleQuery(query)),
      this.untilDestroyed()
    );
  }

  private _handleQuery(query: string): Observable<AddressApiResult[] | null> {
    if (query && query.length >= 3) {
      return this._activityFacadeService.searchAddress(query);
    }
    return of(null);
  }
}
