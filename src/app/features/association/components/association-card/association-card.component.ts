import { AsyncPipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { map, Observable, take, tap } from 'rxjs';
import { TAKE_1 } from 'src/app/common/constants/observables.constants';
import { UserRole } from 'src/app/features/authentication/constants/auth.constants';
import { AuthService } from 'src/app/features/authentication/services/auth.service';
import { environment } from 'src/environments/environment.development';
import { ReportModalComponent } from '../../../report/components/report-modal/report-modal.component';
import { Association } from '../../models/association.model';
import { AssociationFacadeService } from '../../services/association-facade.service';

@Component({
  selector: 'app-association-card',
  imports: [CardModule, ButtonModule, AsyncPipe, ReportModalComponent],
  templateUrl: './association-card.component.html',
  styleUrl: './association-card.component.scss',
})
export class AssociationCardComponent implements OnInit {
  @Input() association!: Association;

  private _authService = inject(AuthService);
  private _associationFacadeService: AssociationFacadeService = inject(AssociationFacadeService);
  public isFollowAssociation$: Observable<boolean>;
  public apiUrl: string = environment.apiUrl;
  public isShowReportModal: boolean = false;

  isVoluntary$: Observable<boolean> = this._authService
    .getRolesUser()
    .pipe(map((roles: UserRole[]) => roles.some(role => role === UserRole.VOLUNTARY)));

  ngOnInit(): void {
    this.isFollowAssociation$ = this._associationFacadeService.getIsFollowAssociation(this.association.id);
  }

  toggleFollow(): void {
    this.isFollowAssociation$
      .pipe(
        tap((isFollow: boolean) => {
          this._associationFacadeService.toggleFollow(this.association.id, !isFollow);
        }),
        take(TAKE_1)
      )
      .subscribe();
  }

  showReportModal(): void {
    this.isShowReportModal = !this.isShowReportModal;
  }

  toLocalDateString(date: string | Date | null | undefined): string {
    if (!date) return '';
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    }
    if (date instanceof Date) {
      return date.toLocaleDateString('fr-FR');
    }
    try {
      return new Date(date).toLocaleDateString('fr-FR');
    } catch {
      return '';
    }
  }
}
