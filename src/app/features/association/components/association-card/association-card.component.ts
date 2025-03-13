import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { AssociationFacadeService } from '../../services/association-facade.service';
import { Observable } from 'rxjs';
import { Association } from '../../model/association.model';
import { AsyncPipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-association-card',
  imports: [AsyncPipe, CardModule, ButtonModule],
  templateUrl: './association-card.component.html',
  styleUrl: './association-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssociationCardComponent implements OnInit {
  @Input() activityId!: string;

  associationFacadeService: AssociationFacadeService = inject(AssociationFacadeService);

  association$!: Observable<Association | null>;

  public apiUrl = environment.apiUrl;

  ngOnInit(): void {
    this.association$ = this.associationFacadeService.getAssociationCard(this.activityId);
  }
}
