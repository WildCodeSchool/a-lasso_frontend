import { createAction, props } from '@ngrx/store';
import { Association } from '../models/association.model';
import { UUIDTypes } from 'uuid';

export const setAssociations = createAction('[associations] setAssociations', props<{ association: Association }>());

export const selectAssociation = createAction('[associations] getAssociation', props<{ associationId: UUIDTypes }>());
