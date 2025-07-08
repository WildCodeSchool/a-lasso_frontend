import { Component, Input, OnInit, inject, DestroyRef } from '@angular/core';
import { catchError, debounceTime, Observable, of, switchMap } from 'rxjs';
import { ActivityFacadeService } from '../../../features/activity/services/activity-facade.service';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputFieldErrorComponent } from 'src/app/common/components/input-field-error/input-field-error.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FloatLabelModule } from 'primeng/floatlabel';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddressApiResult } from '../../../features/authentication/models/user.model';
import { FormField } from '../../../features/authentication/models/form.model';

@Component({
  selector: 'app-search-address',
  templateUrl: './search-address.component.html',
  styleUrl: './search-address.component.scss',
  standalone: true,
  imports: [FormsModule, SelectModule, InputGroupModule, AutoCompleteModule, FloatLabelModule, InputFieldErrorComponent, ReactiveFormsModule],
})
export class SearchAddressComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  @Input() formGroup?: FormGroup;
  @Input({ required: true }) fieldConfig: FormField;

  searchAdressResults: AddressApiResult[] = [];

  constructor(private _activityFacadeService: ActivityFacadeService) {}

  ngOnInit(): void {
    if (!this.formGroup || !this.fieldConfig) return;

    const control = this.formGroup.get(this.fieldConfig.name);
    if (control) {
      const debounceTimeDuration = 600;
      const minimumQueryLength = 3;

      control.valueChanges
        .pipe(
          debounceTime(debounceTimeDuration),
          switchMap((query: string): Observable<AddressApiResult[] | null> => {
            if (query && query.length >= minimumQueryLength) {
              return this._activityFacadeService.searchAdress(query).pipe(
                catchError(error => {
                  console.error('Erreur lors de la recherche d’adresse :', error);
                  return of([]);
                })
              );
            }
            return of(null);
          }),
          takeUntilDestroyed(this._destroyRef)
        )
        .subscribe((results: AddressApiResult[] | null) => {
          this.searchAdressResults = results || [];
        });
    }
  }
}
