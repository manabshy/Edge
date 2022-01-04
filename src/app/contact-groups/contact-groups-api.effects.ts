import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { mergeMap, map, exhaustMap, concatMap } from "rxjs/operators";
// import { ContactGroupsService } from "../shared/services";
import { ContactGroupsPageActions, ContactGroupsApiActions } from "./actions";
import { ContactGroupsService } from "./shared/contact-groups.service";

@Injectable()
export class ContactGroupsApiEffects {
  constructor(private contactGroupService: ContactGroupsService, private actions$: Actions) {}

  // loadContactGroups$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(ContactGroupsPageActions.enter),
  //     exhaustMap(() =>
  //       this.ContactGroupsService
  //         .all()
  //         .pipe(map(ContactGroups => ContactGroupsApiActions.ContactGroupsLoaded({ ContactGroups })))
  //     )
  //   )
  // );

  // createBook$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(ContactGroupsPageActions.createBook),
  //     concatMap(action =>
  //       this.ContactGroupsService
  //         .create(action.book)
  //         .pipe(map(book => ContactGroupsApiActions.bookCreated({ book })))
  //     )
  //   )
  // );

  // updateBook$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(ContactGroupsPageActions.updateBook),
  //     concatMap(action =>
  //       this.ContactGroupsService
  //         .update(action.bookId, action.changes)
  //         .pipe(map(book => ContactGroupsApiActions.bookUpdated({ book })))
  //     )
  //   )
  // );

  // deleteBook$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(ContactGroupsPageActions.deleteBook),
  //     mergeMap(action =>
  //       this.ContactGroupsService
  //         .delete(action.bookId)
  //         .pipe(
  //           map(() => ContactGroupsApiActions.bookDeleted({ bookId: action.bookId }))
  //         )
  //     )
  //   )
  // );
}
