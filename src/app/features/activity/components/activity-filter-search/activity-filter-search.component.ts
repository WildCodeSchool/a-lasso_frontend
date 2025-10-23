import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitySearchFilters } from '../../models/activity.model';
import { MultipleInputFieldComponent } from 'src/app/common/components/multiple-input-field/multiple-input-field.component';
import { FormBuilder } from '@angular/forms';
import { debounceTime, map, Observable, Subject } from 'rxjs';
import { AuthFacade } from 'src/app/features/authentication/services/auth-facade.service';
import { UserType } from 'src/app/features/authentication/models/user.model';
import { DestroyableComponent } from 'src/app/common/utils/DestroyableComponent';

type CustomFieldConfig = {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
};

@Component({
  selector: 'app-activity-filter-search',
  standalone: true,
  imports: [CommonModule, MultipleInputFieldComponent],
  templateUrl: './activity-filter-search.component.html',
  styleUrls: ['./activity-filter-search.component.scss'],
})
export class ActivityFilterSearchComponent extends DestroyableComponent implements OnInit, OnChanges {
  private readonly _fb: FormBuilder = new FormBuilder();
  private _authFacade: AuthFacade = inject(AuthFacade);

  @Input() mobileMode: boolean = false;
  @Input() resetFormTrigger: boolean = false;
  @Output() searchFiltersChanged = new EventEmitter<ActivitySearchFilters>();

  userCity$: Observable<string | null> = this._authFacade.user$.pipe(map(user => (user?.type === UserType.Voluntary ? user.city : null)));

  private _searchTerms$ = new Subject<string>();

  customFieldConfigs: CustomFieldConfig[] = [
    { name: 'search', label: 'Recherche', placeholder: 'Ex : Maraude, sauvetage...' },
    { name: 'date', label: 'Date', placeholder: 'Ex : 02/04/2025', type: 'date' },
    { name: 'location', label: 'Localisation', placeholder: 'Ex : Dijon' },
  ];

  public formGroup = this._fb.group({
    search: [''],
    date: [''],
    location: [''],
  });

  get fieldConfigs(): CustomFieldConfig[] {
    return this.mobileMode ? this.customFieldConfigs.filter(filtered => filtered.name !== 'search') : this.customFieldConfigs;
  }

  ngOnInit(): void {
    this._initializeSearchTermSubscription();

    this.userCity$.pipe(this.untilDestroyed()).subscribe(city => {
      const locationControl = this.formGroup.get('location');
      if (city) {
        locationControl.setValue(city);
        this.onInputValuesChanged();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resetFormTrigger']) {
      this.formGroup.reset();
      this.onInputValuesChanged();
    }
  }

  onInputValuesChanged(): void {
    const location = this.formGroup.value.location ?? '';
    this._searchTerms$.next(location);
  }

  private _initializeSearchTermSubscription(): void {
    this._searchTerms$.pipe(debounceTime(500)).subscribe(term => {
      const filters: ActivitySearchFilters = {
        search: this.formGroup.value.search ?? '',
        date: this.formGroup.value.date ?? '',
        location: term,
      };
      this.searchFiltersChanged.emit(filters);
    });
  }
}
