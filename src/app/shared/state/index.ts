import { ActionReducerMap, createSelector, MetaReducer } from "@ngrx/store";
import * as fromContactGroups from "./contact-groups.reducer";

export interface State {
  contactGroups: fromContactGroups.State;
}

export const reducers: ActionReducerMap<State> = {
  contactGroups: fromContactGroups.reducer,
};


/**
 * ContactGroup Selectors
 */
export const selectContactGroupsState = (state: State) => state.contactGroups;
export const selectAllContactGroups = createSelector(
  selectContactGroupsState,
  fromContactGroups.selectAll
);
