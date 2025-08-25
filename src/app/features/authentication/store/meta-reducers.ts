import { MetaReducer, ActionReducer } from '@ngrx/store';
import { UserState } from '../models/user.model';
import { GlobalState } from 'src/app/common/store/global-state.state';
import { UserActions } from './user.actions';

export const metaReducers: MetaReducer<GlobalState>[] = [userStorageMetaReducer];

export function userStorageMetaReducer(reducer: ActionReducer<GlobalState>): ActionReducer<GlobalState> {
  return (state, action) => {
    const nextState = reducer(state, action);

    if (action.type === UserActions.logout.type) {
      localStorage.removeItem('userState');
      return {
        ...nextState,
        user: {
          userInfos: null,
          isAuthenticated: false,
          error: null,
        },
      };
    }

    if (nextState.user?.isAuthenticated && nextState.user?.userInfos) {
      localStorage.setItem('userState', JSON.stringify(nextState.user));
    }

    return nextState;
  };
}

export function getInitialUserState(): UserState {
  try {
    const stored = localStorage.getItem('userState');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.isAuthenticated && parsed?.userInfos) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error parsing userState from localStorage:', e);
  }

  return {
    userInfos: null,
    isAuthenticated: false,
    error: null,
  };
}
