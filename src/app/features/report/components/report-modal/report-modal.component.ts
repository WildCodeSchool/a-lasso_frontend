import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { FormField } from 'src/app/features/authentication/models/form.model';
import { TextareaFieldComponent } from '../../../../common/components/textarea-field/textarea-field.component';
import { Association } from '../../../association/models/association.model';
import { Report, ReportType, ReportTypeEnum } from '../../models/report.model';
import { ReportFacadeService } from '../../services/report-facade.service';

@Component({
  selector: 'app-report-modal',
  imports: [DialogModule, ButtonModule, Select, FormsModule, ReactiveFormsModule, TextareaFieldComponent],
  templateUrl: './report-modal.component.html',
  styleUrl: './report-modal.component.scss',
})
export class ReportModalComponent {
  private readonly _fb: FormBuilder = new FormBuilder();
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

  public messageMaxLength: number = 700;
  public reportForm = this._fb.group({
    selectedType: [ReportTypeEnum.InappropriateActivity],
    reportContent: ['', [Validators.required, Validators.maxLength(this.messageMaxLength)]],
  });

  public fieldConfig: FormField = {
    name: 'reportContent',
    label: 'Raisons du signalement',
    placeholder: 'Saisir les raisons de votre signalement ici',
    required: true,
  };

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
