import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitySearchFilters } from '../../models/activity.model';
import { MultipleInputFieldComponent } from 'src/app/common/components/multiple-input-field/multiple-input-field.component';
import { FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

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
export class ActivityFilterSearchComponent implements OnInit {
  private readonly _fb: FormBuilder = new FormBuilder();
  @Input() mobileMode: boolean = false;
  @Output() searchFiltersChanged = new EventEmitter<ActivitySearchFilters>();

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
  }

  onInputValuesChanged(): void {
    const location = this.formGroup.value.location ?? '';
    this._searchTerms$.next(location);
  }

  private _initializeSearchTermSubscription(): void {
    this._searchTerms$.pipe(debounceTime(500), distinctUntilChanged()).subscribe(term => {
      const filters: ActivitySearchFilters = {
        search: this.formGroup.value.search ?? '',
        date: this.formGroup.value.date ?? '',
        location: term,
      };
      this.searchFiltersChanged.emit(filters);
    });
  }
}
