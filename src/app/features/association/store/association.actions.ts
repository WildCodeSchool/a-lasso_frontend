import { createAction, props } from '@ngrx/store';
import { Association } from '../models/association.model';
import { UUIDTypes } from 'uuid';

export * as AssociationActions from './association.actions';

const ASSOCIATION_PREFIX = '[Associations]';

export const setAssociations = createAction(`${ASSOCIATION_PREFIX} Set Associations`, props<{ association: Association }>());

export const setManyAssociations = createAction(`${ASSOCIATION_PREFIX} Set Many Associations`, props<{ associations: Association[] }>());

export const selectAssociation = createAction(`${ASSOCIATION_PREFIX} Get Association`, props<{ associationId: UUIDTypes }>());

export const updateFollowStatus = createAction(`${ASSOCIATION_PREFIX} Update Follow Status`, props<{ id: UUIDTypes; isFollow: boolean }>());
