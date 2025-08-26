import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Observable } from 'rxjs';
import { ButtonClicked } from 'src/app/common/models/button';
import { SingleButtonComponent } from '../../../../common/components/single-button/single-button.component';
import { Theme, ThemeName } from '../../models/activity.model';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { ButtonStyleClass } from 'src/app/common/models/button';

@Component({
  selector: 'app-activity-filter',
  standalone: true,
  imports: [AsyncPipe, ButtonModule, SingleButtonComponent],
  templateUrl: './activity-filter.component.html',
  styleUrl: './activity-filter.component.scss',
})
export class ActivityFilterComponent implements OnInit, OnChanges {
  private _activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);
  @Output() selectedThemes: EventEmitter<ThemeName[]> = new EventEmitter<ThemeName[]>();
  @Input() formGroup?: FormGroup;
  @Input() formThemeField?: string;
  @Input() hasLoadedDraft?: boolean;

  themes$!: Observable<Theme[]>;
  selected: ThemeName[] = [];
  ButtonStyleClass = ButtonStyleClass;

  ngOnInit(): void {
    this.themes$ = this._activityFacadeService.getActivityThemesFromApi();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hasLoadedDraft'] && this.formGroup) {
      this.loadDraftThemes();
    }
  }

  loadDraftThemes(): void {
    if (this.formGroup?.value?.selectedThemesName) {
      this.selected = [...this.formGroup.value.selectedThemesName];
    }
  }

  updateSelectedThemes(theme: ButtonClicked): void {
    const index: number = this.selected.findIndex(t => t === theme.label);
    if (index > -1) {
      this.selected.splice(index, 1);
    } else {
      this.selected.push(theme.label as ThemeName);
    }

    this.selectedThemes.emit([...this.selected]);
    if (this.formGroup && this.formThemeField) {
      const selectedThemesForm = this.formGroup.get(this.formThemeField);
      selectedThemesForm.setValue(this.selected);
      selectedThemesForm.markAsTouched();
    }
  }
}
