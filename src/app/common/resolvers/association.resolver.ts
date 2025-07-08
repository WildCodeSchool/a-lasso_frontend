import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { Association } from 'src/app/features/association/models/association.model';
import { AssociationFacadeService } from 'src/app/features/association/services/association-facade.service';

export const associationResolver: ResolveFn<Association> = (route): Observable<Association> => {
  const associationFacadeService = inject(AssociationFacadeService);
  const associationId = route.params['id'];

  return associationFacadeService.getAssociationCard(associationId);
};
