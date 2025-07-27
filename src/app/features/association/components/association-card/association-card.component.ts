import { AsyncPipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Observable, take } from 'rxjs';
import { TAKE_1 } from 'src/app/common/constants/observables.constants';
import { AuthService } from 'src/app/features/authentication/services/auth.service';
import { environment } from 'src/environments/environment';
import { ReportModalComponent } from '../../../report/components/report-modal/report-modal.component';
import { Association } from '../../models/association.model';
import { AssociationFacadeService } from '../../services/association-facade.service';
import { DateFrPipe } from '../../../../common/pipes/DateFr.pipe';

@Component({
  selector: 'app-association-card',
  imports: [CardModule, ButtonModule, AsyncPipe, ReportModalComponent, DateFrPipe],
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

  isVoluntary$: Observable<boolean> = this._authService.isVoluntaryUser();

  ngOnInit(): void {
    this.isFollowAssociation$ = this._associationFacadeService.getIsFollowAssociation(this.association.id);
  }

  toggleFollow(): void {
    this.isFollowAssociation$.pipe(take(TAKE_1)).subscribe((isFollow: boolean) => {
      this._associationFacadeService.toggleFollow(this.association.id, !isFollow);
    });
  }

  showReportModal(): void {
    this.isShowReportModal = !this.isShowReportModal;
  }
}
