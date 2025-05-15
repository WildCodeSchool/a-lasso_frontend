import { Component, Input, OnInit, inject, DestroyRef } from '@angular/core';
import { debounceTime, Observable, of, switchMap } from 'rxjs';
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

    const control = this.formGroup!.get(this.fieldConfig.name);
    if (control) {
      control.valueChanges
        .pipe(
          debounceTime(600),
          switchMap((query: string): Observable<AddressApiResult[] | null> => {
            if (query && query.length >= 3) {
              return this._activityFacadeService.searchAdress(query);
            }
            return of(null);
          }),
          takeUntilDestroyed(this._destroyRef)
        )
        .subscribe((results: AddressApiResult[]) => {
          this.searchAdressResults = results;
        });
    }
  }
}
