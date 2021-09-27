import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { ValuationService } from 'src/app/valuations/shared/valuation.service';
import { FileService } from 'src/app/core/services/file.service';
import { switchMap } from 'rxjs/operators';

export interface ComplianceChecksState {
    checksAreValid: Boolean,
    checkType: String,
    message?: {
      type: String,
      text: Array<string>
    },
    people: Array<any>
}

const defaultState: ComplianceChecksState = {
  checksAreValid: true,
  checkType: '',
  people: []
};

@Injectable()
export class ComplianceChecksStore extends ComponentStore<any> {
  
  constructor(
    private valuationSvc: ValuationService,
    private readonly fileService: FileService
  ) {
    super(defaultState)
    this.valuationSvc.contactGroup$.subscribe(
      (data => {
        console.log('data: ', data)
        if(!data) return
        const dataForView = this.setContactsForCompliance(data)
        this.loadContacts(dataForView)
      })
      )
  }

  readonly data$ = this.select(({ data }) => data);

  readonly loadData = this.updater((state, data: any[] | null) => ({
    ...state,
    data: data || [],
  }));

  readonly loadContacts = this.updater((state, people: any[] | null) => ({
    ...state,
    people: people || [],
  }));

  public readonly people$: Observable<any> = this.select(({ people }) => people)

  public readonly addFilesToContact = this.updater((state, person) => ({
    ...state,
    people: [...state.people, person]
  }))
  
  public saveFilesTemp = this.effect((data$: Observable<any>) => {
    return data$.pipe(
      switchMap((d): any => {
        console.log('ddddddd: ======= ', d)
        if(!d.ev.files) return
        const formData = new FormData();
        d.ev.files.forEach((x) => {
          formData.append("files", x, x.name);
        });
    
        return this.fileService.saveFileTemp(formData).pipe(
          tapResponse(
            (data) => {
            console.log('file upload subscription data: ', data)
            // blobName = name of temporarily stored file
            // fileName = original file name
            this.addTempFilesToPerson(d, data)
            },
            (error) => console.error('error: ', error)
          )
        )
      })
    )
  })

  addTempFilesToPerson(d: any, data: any) {
    console.log('addTempFilesToPerson: ', d)
    try {
      this.setState((state) => {
        return {
          ...state,
          people: state.people.map(person => person.name === d.person.name ? {
            ...person,
            documents: {
              ...person.documents, 
              additionalDocs: {...person.documents.additionalDocs, 
                files: person.documents.additionalDocs.files.push({
                  id: 0,
                  label: 'New Doc',
                  uploadDate: new Date()
                })
              }
            }
          }
          : person
        )
        }
      })
    } catch(e) {
      console.log('e: ', e)
    }
  }

  public deleteFiles = this.effect((file$) => {
    return file$.pipe(
      switchMap((d): any => this.fileService.deleteFile(d).pipe(
        tapResponse(
          (res) => console.log('res: ', res),
          (err) => console.error('err: ', err)
          )
        )
      ))
  })

  public passComplianceChecks(data){
    console.log('TODO: passComplianceChecks: ', data)
  }
  
  private setContactsForCompliance(personGroup)  {
    return personGroup.personPeople.map(person => {
      return {
        name: person.firstName + ' ' + person.lastName,
        pillLabel: person.isMainPerson ? 'lead' : 'associated',
        address: person.address.addressLines ? person.address.addressLines + ' ' + person.address.postCode : '',
        documents: {
          idDoc: {
            documentType: 'ID',
            files: [{
              id:0,
              label: 'ID',
              uploadDate: new Date('07/04/21'),
              expiryDate: '12/11/26'
            }],
          },
          proofOfAddressDoc: {
            documentType: 'proof-of-address',
            label: 'Upload Proof Of Address',
            files: [{
              id:0,
              label: 'Proof of Address',
              uploadDate: new Date('04/09/21')
            }]
          },
          reportDocs: {
            documentType: 'report',
            label: 'Upload Report',
            files: [{
              id:0,
              label: 'Report',
              valid: true,
              uploadDate: new Date('09/09/21')
            }]
          },
          additionalDocs: {
            documentType: 'additional-documents',
            label: 'Upload Additional Documents',
            files: [{
              id:0,
              label: 'Document',
              uploadDate: new Date('01/09/21')
            }]
          }
        }
      }
    })
  }
}