import { createAction, props } from '@ngrx/store';
import { Association } from '../models/association.model';
import { UUIDTypes } from 'uuid';

const ASSOCIATION_PREFIX = '[associations]';

export const setAssociations = createAction(`${ASSOCIATION_PREFIX} setAssociations`, props<{ association: Association }>());

export const setManyAssociations = createAction(`${ASSOCIATION_PREFIX} setManyAssociations`, props<{ associations: Association[] }>());

export const selectAssociation = createAction(`${ASSOCIATION_PREFIX} getAssociation`, props<{ associationId: UUIDTypes }>());

export const updateFollowStatus = createAction(`${ASSOCIATION_PREFIX} updateFollowStatus`, props<{ id: UUIDTypes; isFollow: boolean }>());
