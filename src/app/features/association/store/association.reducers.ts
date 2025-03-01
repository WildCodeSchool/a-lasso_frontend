import { createReducer, on } from '@ngrx/store';
import { Association } from '../model/association.model';
import { setAssociations } from './association.actions';

export const initialAssociationsState: Association[] = [];

export const associationsReducer = createReducer(
  initialAssociationsState,
  on(setAssociations, (state, { association }) => {
    const exists = state.some(item => item.id === association.id);
    if (exists) {
      return state.map(item => (item.id === association.id ? { ...item, ...association } : item)); // Merge if association exist
    }
    return [...state, association];
  })
);
