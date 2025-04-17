import { Component, inject, Input } from '@angular/core';
import { ActivityFacadeService } from '../../services/activity-facade.service';

@Component({
  selector: 'app-favorite-heart',
  imports: [],
  templateUrl: './favorite-heart.component.html',
  styleUrl: './favorite-heart.component.scss',
})
export class FavoriteHeartComponent {
  private _activityFacadeService: ActivityFacadeService = inject(ActivityFacadeService);
  @Input() activityId!: string;
  @Input() isSaved!: boolean;

  toggleFavorite(event: MouseEvent): void {
    event.stopPropagation();
    this._activityFacadeService.toggleSave(this.activityId, this.isSaved);
  }
}
