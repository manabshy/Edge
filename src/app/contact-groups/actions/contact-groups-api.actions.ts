import { createAction, props } from "@ngrx/store";
import { ContactGroupAutoCompleteResult } from "src/app/contact-groups/shared/contact-group.interfaces";

export const contactGroupsLoaded = createAction(
  "Contact Groups Search API] Contract Groups Loaded Success",
  props<{ contactGroups: ContactGroupAutoCompleteResult[] }>()
);

