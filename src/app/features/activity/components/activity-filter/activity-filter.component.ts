import { Component, inject, Input } from '@angular/core';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Theme } from '../../models/theme.model';

@Component({
  selector: 'app-activity-filter',
  imports: [AsyncPipe, ButtonModule],
  templateUrl: './activity-filter.component.html',
  styleUrl: './activity-filter.component.scss',
})
export class ActivityFilterComponent {
  activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);

  @Input() themes$!: Observable<Theme[]>;
}
