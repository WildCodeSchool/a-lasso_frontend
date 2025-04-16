import { Component, inject, OnInit } from '@angular/core';
import { ActivityFilterComponent } from '../../components/activity-filter/activity-filter.component';
import { ThemeNameEnum } from '../../models/activity.model';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { ActivityAddPhotoComponent } from '../../components/activity-add-photo/activity-add-photo.component';

@Component({
  selector: 'app-activity-creation',
  imports: [ActivityFilterComponent, ActivityAddPhotoComponent],
  templateUrl: './activity-creation.component.html',
  styleUrl: './activity-creation.component.scss',
})
export class ActivityCreationComponent implements OnInit {
  activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);

  selectedThemesName: ThemeNameEnum[] = [];

  ngOnInit(): void {
    this.activityFacadeService.getActivityThemesFromApi();
  }

  onSelectedThemeChanges(updatedSelectedThemesName: ThemeNameEnum[]): void {
    this.selectedThemesName = updatedSelectedThemesName;
  }
}
