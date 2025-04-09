import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ActivityFacadeService } from '../../services/activity-facade.service';
import { Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Theme, ThemeNameEnum } from '../../models/activity.model';
import { SingleButtonComponent } from '../../../../common/components/single-button/single-button.component';
import { ButtonClicked } from 'src/app/common/models/buttonClicked';

@Component({
  selector: 'app-activity-filter',
  imports: [AsyncPipe, ButtonModule, SingleButtonComponent],
  templateUrl: './activity-filter.component.html',
  styleUrl: './activity-filter.component.scss',
})
export class ActivityFilterComponent implements OnInit {
  activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);

  themes$!: Observable<Theme[]>;
  public selected: ThemeNameEnum[] = [];

  buttonClicked!: ButtonClicked;

  @Output() selectedThemes: EventEmitter<ThemeNameEnum[]> = new EventEmitter<ThemeNameEnum[]>();

  ngOnInit(): void {
    this.themes$ = this.activityFacadeService.getActivityThemes().pipe(
      tap(themes => {
        themes.sort((a: Theme, b: Theme) => a.name.localeCompare(b.name));
      })
    );
  }

  updateSelectedThemes(theme: ButtonClicked): void {
    const index: number = this.selected.findIndex(t => t === theme.label);
    console.log(index);
    if (index > -1) {
      this.selected.splice(index, 1);
      console.log(this.selected);
    } else {
      this.selected.push(theme.label as ThemeNameEnum);
    }
    this.selectedThemes.emit([...this.selected]);
  }
}
