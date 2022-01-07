import { createAction, props } from "@ngrx/store";
import { ContactGroupAutoCompleteResult } from "src/app/contact-groups/shared/contact-group.interfaces";

export const searchContactGroups= createAction(
  "Contact Groups Search API] Search Contact groups",
  props<{ searchTerm: string }>()
);
export const contactGroupsLoaded = createAction(
  "Contact Groups Search API] Contract Groups Loaded Success",
  props<{ groups: Array<any> }>()
);

