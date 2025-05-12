import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Theme, ThemeName } from '../../models/activity.model';
import { SingleButtonComponent } from '../../../../common/components/single-button/single-button.component';
import { ButtonClicked } from 'src/app/common/models/buttonClicked';
import { FormGroup } from '@angular/forms';
import { InputFieldErrorComponent } from 'src/app/common/components/input-field-error/input-field-error.component';

@Component({
  selector: 'app-activity-filter',
  imports: [AsyncPipe, ButtonModule, SingleButtonComponent, InputFieldErrorComponent],
  templateUrl: './activity-filter.component.html',
  styleUrl: './activity-filter.component.scss',
})
export class ActivityFilterComponent implements OnInit {
  private _activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);
  @Output() selectedThemes: EventEmitter<ThemeName[]> = new EventEmitter<ThemeName[]>();
  @Input() formGroup?: FormGroup;
  @Input() formThemeField?: string;
  themes$!: Observable<Theme[]>;
  selected: ThemeName[] = [];

  ngOnInit(): void {
    this.themes$ = this._activityFacadeService.getActivityThemesFromApi();
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
      selectedThemesForm.setValue(this.selected, { emitEvent: false, onlySelf: true });
      selectedThemesForm.markAsTouched();
    }
  }
}
