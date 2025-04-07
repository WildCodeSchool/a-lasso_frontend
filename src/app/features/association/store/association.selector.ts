import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Association } from '../models/association.model';
import { UUIDTypes } from 'uuid';

export const selectAssociationsState = createFeatureSelector<Association[]>('associations');

export const selectAssociations = createSelector(selectAssociationsState, associations => associations);

export const selectAssociation = (associationId: UUIDTypes): MemoizedSelector<object, Association | null> =>
  createSelector(selectAssociationsState, associations => (associations || []).find(item => item.id === associationId) || null);
