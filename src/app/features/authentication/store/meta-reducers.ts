import { MetaReducer, ActionReducer } from '@ngrx/store';
import { GlobalState } from 'src/app/common/store/global-state.state';
import { UserActions } from './user.actions';

export const metaReducers: MetaReducer<GlobalState>[] = [userStorageMetaReducer];

export function userStorageMetaReducer(reducer: ActionReducer<GlobalState>): ActionReducer<GlobalState> {
  return (state, action) => {
    const nextState = reducer(state, action);

    if (action.type === UserActions.logout.type) {
      return {
        ...nextState,
        user: {
          userInfos: null,
          isAuthenticated: false,
          error: null,
        },
      };
    }

    return nextState;
  };
}
