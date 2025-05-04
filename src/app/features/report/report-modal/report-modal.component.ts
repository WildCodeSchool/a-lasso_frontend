import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Association } from '../../association/models/association.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgStyle } from '@angular/common';
import { MessageService as Toast } from 'primeng/api';
import { ReportType, ReportTypeEnum, Report } from '../models/report.model';
import { ReportFacadeService } from '../services/report-facade.service';
import { TextareaFieldComponent } from '../../../common/components/textarea-field/textarea-field.component';

@Component({
  selector: 'app-report-modal',
  imports: [DialogModule, ButtonModule, Select, FormsModule, ReactiveFormsModule, NgStyle, TextareaFieldComponent],
  templateUrl: './report-modal.component.html',
  styleUrl: './report-modal.component.scss',
})
export class ReportModalComponent implements OnInit {
  private readonly _fb: FormBuilder = new FormBuilder();
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _toast: Toast = inject(Toast);
  private readonly _reportFacadeService: ReportFacadeService = inject(ReportFacadeService);

  @Input() isShowReportModal: boolean = false;
  @Input() association!: Association;

  public reportTypes: ReportType[] = [
    { label: 'Activité proposée inappropriée', value: ReportTypeEnum.InappropriateActivity },
    { label: 'Comportement déplacé', value: ReportTypeEnum.BadBehavior },
    { label: 'Harcèlement', value: ReportTypeEnum.Harassment },
    { label: 'Autre...', value: ReportTypeEnum.Other },
  ];

  public reportForm = this._fb.group({
    selectedType: [ReportTypeEnum.InappropriateActivity],
    reportContent: [''],
  });

  messageContentLength: number = 0;

  ngOnInit(): void {
    this.reportForm
      .get('reportContent')!
      .valueChanges.pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(value => {
        this.messageContentLength = value.length;
      });
  }

  sendReport(): void {
    if (this.messageContentLength === 0) {
      this._toast.add({
        severity: 'error',
        summary: 'Merci de détailler les raisons de votre signalement',
      });
      return;
    }

    if (this.messageContentLength > 700) {
      this._toast.add({
        severity: 'error',
        summary: 'Votre message est trop long, 700 caractères maximum',
      });
      return;
    }

    const creationReport: Report = {
      reportedUser: {
        id: this.association.id,
        userName: this.association.name,
      },
      messageReporter: this.reportForm.value.reportContent,
      reportType: this.reportForm.value.selectedType,
    };

    this._reportFacadeService.sendReport(creationReport);
    this.isShowReportModal = false;
  }
}
