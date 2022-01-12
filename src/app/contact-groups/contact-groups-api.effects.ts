import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { mergeMap, map, exhaustMap, concatMap } from "rxjs/operators";
import { ContactGroupsService } from "./shared/contact-groups.service";
import { ContactGroupsPageActions, ContactGroupsApiActions } from "./actions";

@Injectable()
export class ContactGroupsApiEffects {
  constructor(private contactGroupService: ContactGroupsService, private actions$: Actions) {}

  loadContactGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContactGroupsApiActions.searchContactGroups),
      concatMap((action) => {

        return this.contactGroupService
          .getAutocompleteContactGroups(action.searchTerm, 1, 1)
          .pipe(map(groups => ContactGroupsApiActions.contactGroupsLoaded({groups})));
      })
    )
  );
}
