import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { combineLatest, Observable } from "rxjs";
import { ValuationService } from "src/app/valuations/shared/valuation.service";
import { FileService } from "src/app/core/services/file.service";
import { mergeMap, tap, filter, switchMap, take } from "rxjs/operators";
import { DOCUMENT_TYPE } from "./components/document-info/document-info.component";
import { PeopleService } from "src/app/core/services/people.service";
import { Person } from "../../shared/models/person";
import {
  mapDocsForAPI,
  setContactsForCompliance,
  mergeFiles,
  removeDocFromDocumentsObject,
  checkAllPeopleHaveDocs,
  addFiles,
  identifyAmlOrKyc,
} from "./compliance-checks.store-helpers";

export interface ComplianceChecksState {
  checksAreValid: Boolean;
  checkType: String;
  contactGroupId: Number;
  companyOrContact?: String;
  message?: {
    type: String;
    text: Array<string>;
  };
  people: Array<any>;
}

export interface ComplianceDocTypes {
  idDoc: ComplianceDocs;
  proofOfAddressDoc: ComplianceDocs;
  reportDocs: ComplianceDocs;
  additionalDocs: ComplianceDocs;
}

export interface ComplianceDocs {
  label: String;
  documentType: DOCUMENT_TYPE;
  files: Array<any>;
}

export interface FileUpdateEvent {
  ev: {
    tmpFiles: Array<any>;
    documentType?: DOCUMENT_TYPE;
    IDValidationDateExpiry?: Date;
  };
  person?: Person;
}

export interface FileUpdate {
  tmpFiles: Array<any>;
}

export interface FileDeletionPayload {
  ev: {
    id: Number;
    documentType: DOCUMENT_TYPE;
  };
  person: Person;
}

const defaultState: ComplianceChecksState = {
  contactGroupId: null,
  companyOrContact: "contact",
  checksAreValid: null,
  checkType: "",
  people: [],
};

@Injectable()
export class ComplianceChecksStore extends ComponentStore<ComplianceChecksState> {
  readonly people$: Observable<any> = this.select(({ people }) => people);
  readonly contactGroupId$: Observable<any> = this.select(
    ({ contactGroupId }) => contactGroupId
  );
  readonly checkType$: Observable<any> = this.select(
    ({ checkType }) => checkType
  );
  readonly checksAreValid$: Observable<any> = this.select(
    this.people$,
    this.checkType$,
    (people, checkType) => checkAllPeopleHaveDocs(people, checkType)
  );
  readonly companyOrContact$: Observable<any> = this.select(
    ({ companyOrContact }) => companyOrContact
  );
  readonly message$: Observable<any> = this.select(({ message }) => message);

  public complianceChecksVm$: Observable<any> = this.select(
    this.people$,
    this.contactGroupId$,
    this.checkType$,
    this.checksAreValid$,
    this.companyOrContact$,
    this.message$,
    (
      people,
      contactGroupId,
      checkType,
      checksAreValid,
      companyOrContact,
      message
    ) => ({
      people,
      contactGroupId,
      checkType,
      checksAreValid,
      companyOrContact,
      message,
    })
  );

  public readonly addFilesToContact = this.updater((state, person) => ({
    ...state,
    people: [...state.people, person],
  }));

  readonly loadDataToStore = this.updater((state, data: any[] | null) => ({
    ...state,
    data: data || [],
  }));

  readonly loadContactsToStore = this.updater(
    (state, people: any[] | null) => ({
      ...state,
      people: people || [],
    })
  );

  readonly mergeUserDocsIntoStore = this.updater((state, data: any) => ({
    ...state,
    people: state.people.map((person) =>
      person.personId === data.person.personId
        ? mergeFiles(data, person)
        : person
    ),
  }));

  readonly removeUserDocsFromStore = this.updater((state, data: any) => ({
    ...state,
    people: state.people.map((person) =>
      person.personId === data.person.personId
        ? removeDocFromDocumentsObject(data)
        : person
    ),
  }));

  constructor(
    private valuationSvc: ValuationService,
    private readonly fileService: FileService,
    private peopleService: PeopleService
  ) {
    super(defaultState);
    console.log("Compliance checks store under construction");
    this.loadStore();
  }

  loadStore = () => {
    combineLatest([
      this.valuationSvc.contactGroup$,
      this.valuationSvc.valuationPricingInfo$,
    ])
      .pipe(
        filter(([data]) => data && !!data.contactGroupId),
        take(1),
        tap(([data, pricingInformation]) => {
          this.patchState({
            contactGroupId: data.contactGroupId,
            checkType: identifyAmlOrKyc(pricingInformation),
          });
        }),
        mergeMap(([data]) =>
          this.peopleService.getPeopleDocs(data.contactGroupId)
        )
      )
      .subscribe(
        (data) => {
          console.log("LOAD PEOPLE SUBSCRIBE");
          if (!data) return;
          return this.patchState({
            people: setContactsForCompliance(data),
          });
        },
        (err) => {
          console.error("error!: ", err);
        }
      );
  };

  /***
   * @description attempts to pass compliance checks and stamps timestamp of success into ?Validation object?
   */
  public passComplianceChecks(data) {
    // TODO
    this.patchState({
      message: {
        type: "success",
        text: ["AML Completed", "SmartSearch added: 7th Sep 2020 (11:45)"],
      },
    });
    this.patchState({ checksAreValid: true });
  }

  /***
   * @description saves file(s) to API. Updates local model with new file(s)
   */
  public addFilesToPerson = (data: FileUpdateEvent) => {
    if (!data.ev.tmpFiles) return;
    const formData = new FormData();
    data.ev.tmpFiles.forEach((x) => {
      formData.append("files", x, x.name);
    });

    return combineLatest([
      this.fileService.saveFileTemp(formData),
      this.contactGroupId$,
      this.people$.pipe(take(1)),
    ])
      .pipe(
        filter(([tmpFiles]) => tmpFiles.files.length),
        switchMap(([tmpFiles, contactGroupId, people]) => {
          console.log("saving files switchMap");
          const person = people.filter(
            (person) => person.personId === data.person.personId
          );
          const mergedDocsForPerson = addFiles(
            { ev: data.ev, files: tmpFiles.files },
            person[0]
          );
          const personForSave = {
            ...person[0],
            documents: mapDocsForAPI(mergedDocsForPerson.documents),
          };
          return this.peopleService.setPeopleDocs(
            personForSave,
            contactGroupId
          );
        })
      )
      .subscribe(
        (person) => {
          console.log("person to merge: ", person);
          return this.mergeUserDocsIntoStore({
            ...data,
            tmpFiles: person.documents,
          }); // merges complete file into relevant person
        },
        (err) => console.error(err)
      );
  };

  /***
   * @function deleteFileFromPerson
   * @param data:
   * @description deletes a compliance doc from a person
   */
  public deleteFileFromPerson = (data: FileDeletionPayload) => {
    this.removeUserDocsFromStore(data);

    combineLatest([this.contactGroupId$, this.people$])
      .pipe(
        mergeMap(([contactGroupId, people]) => {
          const person = people.filter(
            (person) => person.personId === data.person.personId
          );
          const personForSave = {
            ...person[0],
            documents: mapDocsForAPI(person[0].documents),
          };
          return this.peopleService.setPeopleDocs(
            personForSave,
            contactGroupId
          );
        })
      )
      .subscribe(
        (res) => {
          console.log("delete doc subscribe: ", res);
        },
        (err) => console.error("Err!: ", err)
      );
  };
}
