import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Theme } from '../../models/activity.model';

@Component({
  selector: 'app-activity-filter',
  imports: [AsyncPipe, ButtonModule],
  templateUrl: './activity-filter.component.html',
  styleUrl: './activity-filter.component.scss',
})
export class ActivityFilterComponent implements OnInit {
  activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);

  themes$!: Observable<Theme[]>;
  public selected: Theme[] = [];

  @Output() selectedThemes: EventEmitter<Theme[]> = new EventEmitter<Theme[]>();

  ngOnInit(): void {
    this.themes$ = this.activityFacadeService.getActivityThemes();
  }

  updateSelectedThemes(theme: Theme): void {
    const index: number = this.selected.findIndex(t => t === theme);
    console.log(index);
    if (index > -1) {
      this.selected.splice(index, 1);
      console.log(this.selected);
    } else {
      this.selected.push(theme);
    }
    this.selectedThemes.emit([...this.selected]);
  }
}
