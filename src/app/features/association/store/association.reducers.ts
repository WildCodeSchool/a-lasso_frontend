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
      return state.map(item => (item.id === association.id ? { ...item, ...association } : item)); // Merge if association exist
    }
    return [...state, association];
  }),
  on(AssociationActions.updateFollowStatus, (state, { id, isFollow }) =>
    state.map(assocation =>
      assocation.id === id
        ? {
            ...assocation,
            isFollow,
          }
        : assocation
    )
  ),
  on(ActivityActions.clearUserActivityInfos, state =>
    state.map(association => ({
      ...association,
      isFollow: false,
    }))
  )
);
