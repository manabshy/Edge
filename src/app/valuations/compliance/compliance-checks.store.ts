import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { combineLatest, Observable, of } from 'rxjs';
import { ValuationService } from 'src/app/valuations/shared/valuation.service';
import { FileService } from 'src/app/core/services/file.service';
import { mergeMap, tap, filter, switchMap, take, first } from 'rxjs/operators';
import { PeopleService } from 'src/app/core/services/people.service';
import { Person } from '../../shared/models/person';
import {
  mapDocsForAPI,
  setContactsForCompliance,
  mergeFiles,
  removeDocFromDocumentsObject,
  checkAllPeopleHaveValidDocs,
  addFiles,
  buildPartialLoadState,
  buildComplianceChecksStatusMessages,
  personValidForAML,
  personValidForKYC,
  workOutDataShapeForApi,
  addDocsShell,
} from './compliance-checks.store-helpers';
import { ContactGroupsService } from 'src/app/contact-groups/shared/contact-groups.service';
import { ComplianceChecksState, FileUpdateEvent, FileDeletionPayload } from './compliance-checks.interfaces';

const defaultState: ComplianceChecksState = {
  contactGroupId: null,
  companyOrContact: null,
  checksAreValid: null,
  compliancePassedDate: null,
  compliancePassedBy: '',
  checkType: '',
  people: [],
  valuationEventId: null,
  companyId: null,
  isFrozen: null,
};

@Injectable()
export class ComplianceChecksStore extends ComponentStore<ComplianceChecksState> {
  // Observable slices of store state
  readonly people$: Observable<any> = this.select(({ people }) => people);
  readonly contactGroupId$: Observable<any> = this.select(({ contactGroupId }) => contactGroupId);
  readonly checkType$: Observable<any> = this.select(({ checkType }) => checkType);
  readonly checksAreValid$: Observable<any> = this.select(this.people$, this.checkType$, (people, checkType) =>
    checkAllPeopleHaveValidDocs(people, checkType),
  );
  readonly companyOrContact$: Observable<any> = this.select(({ companyOrContact }) => companyOrContact);
  readonly message$: Observable<any> = this.select(({ message }) => message);
  readonly compliancePassedBy$: Observable<any> = this.select(({ compliancePassedBy }) => compliancePassedBy).pipe();
  readonly compliancePassedDate$: Observable<any> = this.select(
    ({ compliancePassedDate }) => compliancePassedDate,
  ).pipe();
  readonly valuationEventId$: Observable<any> = this.select(({ valuationEventId }) => valuationEventId).pipe();
  readonly companyId$: Observable<any> = this.select(({ companyId }) => companyId).pipe();
  readonly isFrozen$: Observable<any> = this.select(({ isFrozen }) => isFrozen).pipe();

  // Public observable streams
  readonly contactGroupDetails$: Observable<any> = this.contactGroupId$.pipe(
    filter((val) => !!val),
    switchMap((contactGroupId) => {
      return this.contactGroupService.getContactGroupById(contactGroupId, true);
    }),
  );
  readonly validationMessage$: Observable<any> = combineLatest([
    this.people$,
    this.checkType$,
    this.compliancePassedDate$,
    this.compliancePassedBy$,
  ]).pipe(
    filter(([people]) => !!people.length),
    tap(([people, checkType, compliancePassedDate, compliancePassedBy]) => {
      const validationMessageData = buildComplianceChecksStatusMessages(
        people,
        checkType,
        compliancePassedDate,
        compliancePassedBy,
      );
      this.patchState({
        checksAreValid: validationMessageData.valid,
        message: {
          type: validationMessageData.type,
          text: validationMessageData.text,
        },
      });
    }),
  );

  public peopleArrayShapedForApi$: Observable<any> = combineLatest([
    this.people$,
    this.companyOrContact$,
    this.companyId$,
    this.contactGroupId$,
  ]).pipe(
    mergeMap(([people, companyOrContact, companyId, contactGroupId]) => {
      return of(workOutDataShapeForApi(people, companyOrContact, companyId, contactGroupId));
    }),
  );

  public complianceChecksVm$: Observable<any> = this.select(
    this.people$,
    this.contactGroupId$,
    this.contactGroupDetails$,
    this.checkType$,
    this.checksAreValid$,
    this.companyOrContact$,
    this.message$,
    this.isFrozen$,
    (people, contactGroupId, contactGroupDetails, checkType, checksAreValid, companyOrContact, message, isFrozen) => ({
      people,
      contactGroupId,
      contactGroupDetails,
      checkType,
      checksAreValid,
      companyOrContact,
      message,
      isFrozen,
    }),
  );

  // Store updaters. Creates immutable changes to store objects. Observable streams will update accordingly

  readonly loadDataToStore = this.updater((state, data: any[] | null) => ({
    ...state,
    data: data || [],
  }));

  readonly loadContactsToStore = this.updater((state, people: any[] | null) => ({
    ...state,
    people: people || [],
  }));

  readonly mergeUserDocsIntoStore = this.updater((state, data: any) => ({
    ...state,
    people: state.people.map((person) =>
      person.personId === data.person.personId ? mergeFiles(data, person) : person,
    ),
  }));

  readonly removeUserDocsFromStore = this.updater((state, data: any) => ({
    ...state,
    people: state.people.map((person) =>
      person.personId === data.person.personId ? removeDocFromDocumentsObject(data) : person,
    ),
  }));

  readonly removeAmlCheckTimestampFromUser = this.updater((state, personId: string) => ({
    ...state,
    people: state.people.map((person) =>
      person.personId === personId ? { ...person, personDateAmlCompleted: null } : person,
    ),
  }));

  readonly toggleUserIsUBO = this.updater((state, companyId: string) => ({
    ...state,
    people: state.people.map((person) =>
      person.companyId === companyId
        ? {
            ...person,
            isUBO: !person.isUBO,
            uboAdded: person.isUBO ? null : new Date(),
            uboRemoved: person.isUBO ? new Date() : null,
          }
        : person,
    ),
  }));

  readonly addAmlCheckTimestampToUsers = this.updater((state) => ({
    ...state,
    people: state.people.map((person) => {
      return { ...person, personDateAmlCompleted: new Date() };
    }),
  }));

  readonly addFilesToUser = this.updater((state, params: any) => ({
    ...state,
    people: state.people.map((person) =>
      person.originalId === params.data.person.originalId
        ? addFiles({ ev: params.data.ev, files: params.tmpFiles.files }, person)
        : person,
    ),
  }));

  readonly addCompanyToValuation = this.updater((state, companyToAdd: any) => ({
    ...state,
    people: [...state.people, { ...companyToAdd, documents: addDocsShell() }],
  }));

  constructor(
    private valuationSvc: ValuationService,
    private readonly fileService: FileService,
    private peopleService: PeopleService,
    private contactGroupService: ContactGroupsService,
  ) {
    super(defaultState);
    this.loadStore();
  }

  loadStore = () => {
    combineLatest([this.valuationSvc.contactGroup$, this.valuationSvc.valuation$])
      .pipe(
        filter(([contactGroupData, valuation]) => !!valuation && !!contactGroupData),
        take(1),
        tap(([contactGroupData, valuationData]) =>
          this.patchState(buildPartialLoadState(contactGroupData, valuationData)),
        ),
        mergeMap(([contactGroupData, valuation]) => {
          if (contactGroupData.companyId) {
            return this.peopleService.getCompanyPeopleDocs(contactGroupData.contactGroupId);
          } else if (valuation && valuation.propertyOwner) {
            return this.peopleService.getPeopleDocs(valuation.propertyOwner.contactGroupId, valuation.valuationEventId);
          }
        }),
        mergeMap((data) => {
          let peopleData;
          if (data.companyDocuments) {
            peopleData = data.companyDocuments.concat(data.personDocuments);
            return of(this.patchState({ people: setContactsForCompliance(peopleData) }));
          } else {
            return of(this.patchState({ people: setContactsForCompliance(data) }));
          }
        }),
        mergeMap(() => this.validationMessage$.pipe(take(1))),
      )
      .subscribe(
        (res) => {
          console.log('store loaded: ', res);
        },
        (err) => {
          console.error('error!: ', err);
        },
      );
  };

  /***
   * @description this function can only run if checks criteria has been met see this.checksAreValid$
   * it loops all people and stamps their personDateAmlCompleted property saving to API. Displays a message to user that AML checks have passed.
   */
  public passComplianceChecks() {
    let valuationEventIdClosure;
    combineLatest([this.checksAreValid$, this.valuationEventId$])
      .pipe(
        take(1),
        filter(([checksAreValid]) => checksAreValid),
        mergeMap(([checksAreValid, valuationEventId]: [any, number]) => {
          valuationEventIdClosure = valuationEventId;
          this.addAmlCheckTimestampToUsers();
          return this.peopleArrayShapedForApi$;
        }),
        mergeMap((userDataForApi) => {
          console.log('mergeMap((userDataForApi) => { ==========');
          if (userDataForApi.peopleToSave) {
            return this.peopleService.setPeopleDocs(
              userDataForApi.peopleToSave,
              userDataForApi.contactGroupId,
              valuationEventIdClosure,
            );
          } else {
            return this.peopleService.setCompanyPeopleDocs(userDataForApi.savePayload, userDataForApi.contactGroupId);
          }
        }),
        // mergeMap(() => this.valuationEventId$),
        take(1),
        mergeMap(() => {
          return this.valuationSvc.setComplianceChecksPassedState(valuationEventIdClosure, {
            customPassedDate: new Date(),
            isPassed: true,
          });
        }),
        tap((res) => {
          return this.patchState({
            compliancePassedBy: res.compliancePassedByFullName,
            compliancePassedDate: res.compliancePassedDate,
            isFrozen: true,
          });
        }),
        mergeMap(() => this.validationMessage$.pipe(take(1))),
      )
      .subscribe(
        (res) => {
          console.log('AML checks passed ');
        },
        (err) => {
          console.error('err: ', err);
        },
      );
  }

  /***
   * @description saves file(s) to API. Updates local model with new file(s)
   */
  public addFilesToPerson = (data: FileUpdateEvent) => {
    if (!data.ev.tmpFiles) return;
    const formData = new FormData();
    data.ev.tmpFiles.forEach((x) => {
      formData.append('files', x, x.name);
    });

    return this.fileService
      .saveFileTemp(formData)
      .pipe(
        mergeMap((tmpFiles) => {
          this.addFilesToUser({ tmpFiles, data }); // adds files to store
          return this.peopleArrayShapedForApi$;
        }),
        tap((data) => {
          this.valuationSvc.updatePersonDocuments(data.peopleToSave); // pops personDocuments array into valuation service to get picked up if/when valuation is saved
        }),
      )
      .subscribe(
        () => {
          console.log('temp doc added to person');
        },
        (err) => console.error(err),
      );
  };

  /***
   * @function deleteFileFromPerson
   * @param data:
   * @description deletes a compliance doc from a person
   */
  public deleteFileFromPerson = (data: FileDeletionPayload) => {
    this.removeUserDocsFromStore(data);

    return this.patchState({
      checksAreValid: false,
      // compliancePassedDate: null,
      // compliancePassedBy: null,
    });
  };

  public addContact = (data: any) => {
    console.log('TODO: addContact: ', data);
  };

  public addCompany = (data: any) => {
    console.log('TODO: addCompany: ', data);
    of(
      this.addCompanyToValuation({
        id: data.companyId,
        companyId: data.companyId,
        name: data.companyName,
        address: data.companyAddress?.addressLines,
      }),
    )
      .pipe(
        mergeMap(() => {
          return this.peopleArrayShapedForApi$;
        }),
        mergeMap((userDataForApi) => {
          if (userDataForApi.peopleToSave) {
            return this.peopleService.setPeopleDocs(userDataForApi.peopleToSave, userDataForApi.contactGroupId, 22);
          } else {
            // this.addAssociatedCompanyId(userDataForApi.savePayload)
            return this.peopleService.setCompanyPeopleDocs(userDataForApi.savePayload, userDataForApi.contactGroupId);
          }
        }),
      )
      .subscribe(
        () => {},
        (err) => {
          console.error('addCompanyErr! ', err);
        },
      );
  };

  public toggleIsUBO = (data: any) => {
    console.log('TODO: toggleIsUBO: ', data);
    this.toggleUserIsUBO(data.companyId);
    this.peopleArrayShapedForApi$
      .pipe(
        mergeMap((userDataForApi) => {
          return this.peopleService.setCompanyPeopleDocs(userDataForApi.savePayload, userDataForApi.contactGroupId);
        }),
      )
      .subscribe(
        () => {},
        (err) => {
          console.error('addCompanyErr! ', err);
        },
      );
  };

  public removeContact = (data: any) => {
    console.log('TODO: removeContact: ', data);
  };

  public saveContact = (data: any) => {
    console.log('saveContact: ', data);
  };

  public onRefreshDocuments = (data: any) => {
    console.log('onRefreshDocuments: ', data);
    combineLatest([this.contactGroupId$, this.valuationEventId$])
      .pipe(
        mergeMap(([contactGroupId, valuationEventId]: [any, any]) => {
          return this.peopleService.deletePeopleDocs(contactGroupId, valuationEventId);
        }),
        mergeMap((data) => {
          console.log('back from deleting documents. set these people to the store: ', data);
          const people = data.map((p) => {
            return { ...p, personDateAmlCompleted: null };
          });
          this.patchState({
            people: setContactsForCompliance(people),
            isFrozen: false,
          });
          return this.validationMessage$;
        }),
      )
      .subscribe(
        (res) => {
          console.log('refresh docs res: ', res);
        },
        (err) => {
          console.error('error: ', err);
        },
      );
  };
}
