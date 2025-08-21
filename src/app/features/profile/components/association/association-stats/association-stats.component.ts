import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Observable, take } from 'rxjs';
import { TAKE_1 } from 'src/app/common/constants/observables.constants';
import { showSuccessToast } from 'src/app/common/utils/toast.utils';
import { Statistic } from 'src/app/features/association/models/association.model';
import { AuthFacade } from 'src/app/features/authentication/services/auth-facade.service';
import { AssociationProfileFacadeService } from '../../../services/association-profile-facade.service';

@Component({
  selector: 'app-association-stats',
  templateUrl: './association-stats.component.html',
  styleUrls: ['./association-stats.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class AssociationStatsComponent implements OnInit {
  private _authFacade = inject(AuthFacade);
  private _profileFacade = inject(AssociationProfileFacadeService);
  private _toast: MessageService = inject(MessageService);

  @Output() cardsCountChanged = new EventEmitter<number>();

  stats$: Observable<Statistic[]> = this._authFacade.associationStats$;

  newCard: Partial<Statistic> = {};

  ngOnInit(): void {
    this._initAssociationStats();
  }

  addCard(currentCards: Statistic[]): void {
    const maxCardLimit = 3;
    if (currentCards.length >= maxCardLimit) return;
    if (!this.newCard.value || !this.newCard.description) return;

    const updatedCards = [
      ...currentCards,
      {
        value: this.newCard.value,
        description: this.newCard.description,
      },
    ];

    this._updateStats(updatedCards);
  }

  removeCard(currentCards: Statistic[], index: number): void {
    const updatedCards = currentCards.filter((_, i) => i !== index);
    this._updateStats(updatedCards);
  }

  private _initAssociationStats(): void {
    this.stats$.pipe(take(TAKE_1)).subscribe(cards => {
      this.cardsCountChanged.emit(cards.length);
    });
  }

  private _updateStats(updatedCards: Statistic[]): void {
    this._profileFacade.updateCurrentAssociationStats(updatedCards).subscribe({
      next: () => {
        this.cardsCountChanged.emit(updatedCards.length);
        this.newCard = {};
        showSuccessToast(this._toast);
      },
    });
  }
}
