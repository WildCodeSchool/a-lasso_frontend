import { Component, inject, Input, OnInit } from '@angular/core';
import { AssociationFacadeService } from '../../services/association-facade.service';
import { Association } from '../../models/association.model';
import { AsyncPipe, DatePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { environment } from 'src/environments/environment.development';
import { Observable, take, tap } from 'rxjs';

@Component({
  selector: 'app-association-card',
  imports: [CardModule, ButtonModule, DatePipe, AsyncPipe],
  templateUrl: './association-card.component.html',
  styleUrl: './association-card.component.scss',
})
export class AssociationCardComponent implements OnInit {
  @Input() association!: Association;

  private _associationFacadeService: AssociationFacadeService = inject(AssociationFacadeService);
  public apiUrl = environment.apiUrl;
  public isFollowAssociation$: Observable<boolean>;

  ngOnInit(): void {
    this.isFollowAssociation$ = this._associationFacadeService.getIsFollowAssociation(this.association.id);
  }

  toggleFollow(): void {
    this.isFollowAssociation$
      .pipe(
        tap((isFollow: boolean) => {
          this._associationFacadeService.toggleFollow(this.association.id, !isFollow);
        }),
        take(1)
      )
      .subscribe();
  }
}
