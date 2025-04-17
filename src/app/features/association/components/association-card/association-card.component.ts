import { Component, inject, Input } from '@angular/core';
import { AssociationFacadeService } from '../../services/association-facade.service';
import { Association } from '../../models/association.model';
import { DatePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { environment } from 'src/environments/environment.development';
import { UUIDTypes } from 'uuid';

@Component({
  selector: 'app-association-card',
  imports: [CardModule, ButtonModule, DatePipe],
  templateUrl: './association-card.component.html',
  styleUrl: './association-card.component.scss',
})
export class AssociationCardComponent {
  @Input() association!: Association;

  private _associationFacadeService: AssociationFacadeService = inject(AssociationFacadeService);
  public apiUrl = environment.apiUrl;

  toggleFollow(associationId: UUIDTypes, isFollow: boolean): void {
    this._associationFacadeService.toggleFollow(associationId, isFollow);
  }
}
