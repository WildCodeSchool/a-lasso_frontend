import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Association } from '../../../association/models/association.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgStyle } from '@angular/common';
import { TextareaFieldComponent } from '../../../../common/components/textarea-field/textarea-field.component';
import { ReportFacadeService } from '../../services/report-facade.service';
import { ReportType, ReportTypeEnum, Report } from '../../models/report.model';
import { InputFieldErrorComponent } from '../../../../common/components/input-field-error/input-field-error.component';

@Component({
  selector: 'app-report-modal',
  imports: [DialogModule, ButtonModule, Select, FormsModule, ReactiveFormsModule, NgStyle, TextareaFieldComponent, InputFieldErrorComponent],
  templateUrl: './report-modal.component.html',
  styleUrl: './report-modal.component.scss',
})
export class ReportModalComponent implements OnInit {
  private readonly _fb: FormBuilder = new FormBuilder();
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _reportFacadeService: ReportFacadeService = inject(ReportFacadeService);

  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() visible: boolean = false;
  @Input() association!: Association;

  public reportTypes: ReportType[] = [
    { label: 'Activité proposée inappropriée', value: ReportTypeEnum.InappropriateActivity },
    { label: 'Comportement déplacé', value: ReportTypeEnum.BadBehavior },
    { label: 'Harcèlement', value: ReportTypeEnum.Harassment },
    { label: 'Autre...', value: ReportTypeEnum.Other },
  ];

  public reportForm = this._fb.group({
    selectedType: [ReportTypeEnum.InappropriateActivity],
    reportContent: ['', [Validators.required, Validators.maxLength(700)]],
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
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
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
    this.closeModal();
  }

  closeModal(): void {
    this.visibleChange.emit(!this.visible);
  }
}
