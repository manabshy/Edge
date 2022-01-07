import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on, Action, createSelector } from "@ngrx/store";
import { ContactGroupAutoCompleteResult } from "src/app/contact-groups/shared/contact-group.interfaces";
import { ContactGroupsPageActions, ContactGroupsApiActions } from "src/app/contact-groups/actions";
import { act } from "@ngrx/effects";


export interface State {
  collection: ContactGroupAutoCompleteResult[];
  searchTerm: string;
}

export const initialState: State = {
  collection: [],
  searchTerm: null
};

export const contactGroupsReducer = createReducer(
  initialState,
  on(ContactGroupsApiActions.searchContactGroups, (state, action) => {
    return {
      ...state,
      collection: [],
      searchTerm: action.searchTerm
    };
  }),
  on(ContactGroupsApiActions.contactGroupsLoaded, (state, action) => {
    return {
      ...state,
      collection: action.groups
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
