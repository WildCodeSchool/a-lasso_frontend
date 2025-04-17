import { createReducer, on } from '@ngrx/store';
import { Association } from '../models/association.model';
import * as AssociationActions from './association.actions';
import * as ActivityActions from '../../activity/store/activities.actions';

export const initialAssociationsState: Association[] = [];

export const associationsReducer = createReducer(
  initialAssociationsState,
  on(AssociationActions.setAssociations, (state, { association }) => {
    const exists = state.some(item => item.id === association.id);
    if (exists) {
      return state.map(item => (item.id === association.id ? { ...item, ...association } : item));
    }
    return [...state, association];
  }),
  on(AssociationActions.setManyAssociations, (state, { associations }) => {
    const updatedMap = new Map(state.map(a => [a.id.toString(), a]));
    associations.forEach(assoc => {
      updatedMap.set(assoc.id.toString(), { ...updatedMap.get(assoc.id.toString()), ...assoc });
    });
    return Array.from(updatedMap.values());
  }),
  on(ActivityActions.clearUserActivityInfos, state =>
    state.map(association => ({
      ...association,
      isFollow: false,
    }))
  )
);
