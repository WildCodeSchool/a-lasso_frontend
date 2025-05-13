import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { Report, reportTypeLabels } from '../../models/report.model';
import { DatePipe } from '@angular/common';
import { Button } from 'primeng/button';
import { TableDataComponent } from '../../../../common/components/table-data/table-data.component';
import { Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCommentaryAdmin } from '../../store/reports.selector';
import { MessageService as Toast } from 'primeng/api';
import { ReportFacadeService } from '../../services/report-facade.service';

@Component({
  selector: 'app-report-details-modal',
  imports: [Dialog, DatePipe, Button, TableDataComponent],
  templateUrl: './report-details-modal.component.html',
  styleUrl: './report-details-modal.component.scss',
})
export class ReportDetailsModalComponent implements OnInit {
  private _store: Store = inject(Store);
  private _toast: Toast = inject(Toast);
  private _reportFacadeService: ReportFacadeService = inject(ReportFacadeService);

  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() visible: boolean = false;
  @Input() report!: Report;

  readonly reportTypeLabels = reportTypeLabels;

  commentaryAdmin$: Observable<string>;

  ngOnInit(): void {
    this.commentaryAdmin$ = this._store.select(selectCommentaryAdmin(this.report.reportId));
  }

  closeReport(): void {
    this.commentaryAdmin$.pipe(take(1)).subscribe(comment => {
      if (!comment || comment.trim() === '') {
        this._toast.add({
          severity: 'warn',
          summary: 'Commentaire administrateur obligatoire avant la clôture du signalement',
        });
        return;
      }

      this._reportFacadeService.closeReport(this.report.reportId);
      this.visibleChange.emit(false);
    });
  }
}
