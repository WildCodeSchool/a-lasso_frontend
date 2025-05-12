import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitySearchFilters } from '../../models/activity.model';
import { MultipleInputFieldComponent } from 'src/app/common/components/multiple-input-field/multiple-input-field.component';

@Component({
  selector: 'app-activity-filter-search',
  standalone: true,
  imports: [CommonModule, MultipleInputFieldComponent],
  templateUrl: './activity-filter-search.component.html',
  styleUrls: ['./activity-filter-search.component.scss'],
})
export class ActivityFilterSearchComponent {
  @Output() searchFiltersChanged = new EventEmitter<ActivitySearchFilters>();

  customFieldConfigs = [
    { name: 'search', label: 'Recherche', placeholder: 'Ex : Maraude, sauvetage...' },
    { name: 'date', label: 'Date', placeholder: 'Ex : 02/04/2025', type: 'date' },
    { name: 'location', label: 'Localisation', placeholder: 'Ex : Dijon' },
  ];

  onInputValuesChanged(values: Record<string, string>): void {
    const filters: ActivitySearchFilters = {
      search: values['search'] ?? '',
      date: values['date'] ?? '',
      location: values['location'] ?? '',
    };

    this.searchFiltersChanged.emit(filters);
  }
}
