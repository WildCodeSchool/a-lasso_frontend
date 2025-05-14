import { Component, Input, OnInit, inject, DestroyRef } from '@angular/core';
import { debounceTime, switchMap } from 'rxjs';
import { ActivityFacadeService } from '../services/activity-facade.service';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputFieldConfig } from 'src/app/common/models/input.models';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputFieldErrorComponent } from 'src/app/common/components/input-field-error/input-field-error.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddressApiResult } from '../../authentication/models/user.model';

@Component({
  selector: 'app-activity-search-adress',
  templateUrl: './activity-search-adress.component.html',
  styleUrl: './activity-search-adress.component.scss',
  standalone: true,
  imports: [FormsModule, SelectModule, InputGroupModule, AutoCompleteModule, InputFieldErrorComponent, ReactiveFormsModule],
})
export class ActivitySearchAdressComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  @Input() formGroup?: FormGroup;
  @Input() fieldConfig?: InputFieldConfig;

  searchAdressResults: AddressApiResult[] = [];

  constructor(private _activityFacadeService: ActivityFacadeService) {}

  ngOnInit(): void {
    if (!this.formGroup || !this.fieldConfig) return;

    const control = this.formGroup!.get(this.fieldConfig.name);
    if (control) {
      control.valueChanges
        .pipe(
          debounceTime(600),
          switchMap((query: string) => {
            if (query && query.length >= 3) {
              return this._activityFacadeService.searchAdress(query);
            }
            return [];
          }),
          takeUntilDestroyed(this._destroyRef)
        )
        .subscribe((results: AddressApiResult[]) => {
          this.searchAdressResults = results;
        });
    }
  }
}
