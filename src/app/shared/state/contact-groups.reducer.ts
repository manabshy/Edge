import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on, Action, createSelector } from "@ngrx/store";
import { ContactGroupAutoCompleteResult } from "src/app/contact-groups/shared/contact-group.interfaces";
import { ContactGroupsPageActions, ContactGroupsApiActions } from "src/app/contact-groups/actions";


export interface State {
  collection: ContactGroupAutoCompleteResult[];
}

export const initialState: State = {
  collection: [],
};

export const contactGroupsReducer = createReducer(
  initialState,
  on(ContactGroupsApiActions.contactGroupsLoaded, (state, action) => {
    return {
      ...state,
      collection: action.contactGroups
    };
  }),
);

export function reducer(state: State | undefined, action: Action) {
  return contactGroupsReducer(state, action);
}

export const selectAll = (state: State) => state.collection;
export const selectActiveBook = createSelector(
  selectAll,
  (books, activeBookId) => books.find(book => book.id === activeBookId) || null
);
