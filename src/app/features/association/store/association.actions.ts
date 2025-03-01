import { createAction, props } from '@ngrx/store';
import { Association } from '../model/association.model';

export const setAssociations = createAction('[associations] setAssociations', props<{ association: Association }>());

export const selectAssociation = createAction('[associations] getAssociation', props<{ associationId: string }>());
