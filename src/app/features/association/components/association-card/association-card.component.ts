import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { AssociationFacadeService } from '../../services/association-facade.service';
import { Observable } from 'rxjs';
import { Association } from '../../model/association.model';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-association-card',
  imports: [AsyncPipe],
  templateUrl: './association-card.component.html',
  styleUrl: './association-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssociationCardComponent implements OnInit {
  @Input() activityId!: string;

  associationFacadeService: AssociationFacadeService = inject(AssociationFacadeService);

  association$!: Observable<Association | null>;

  ngOnInit(): void {
    this.association$ = this.associationFacadeService.getAssociationCard(this.activityId);
  }
}
