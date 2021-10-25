import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageMap } from '@ngx-pwa/local-storage';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { ContactGroup } from 'src/app/contact-groups/shared/contact-group';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { Email, Person } from '../../models/person';
import { Office, StaffMember } from '../../models/staff-member';
import lodash from 'lodash';
import { SubSink } from 'subsink';
import { ContactGroupsService } from 'src/app/contact-groups/shared/contact-groups.service';
import { RequestOption } from 'src/app/core/shared/utils';
import { PropertyService } from 'src/app/property/shared/property.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { AppConstants, FormErrors } from 'src/app/core/shared/app-constants';
import { Observable, of } from 'rxjs';
import { BasicStaffMember } from 'src/app/dashboard/shared/dashboard';
import { BaseStaffMember } from '../../models/base-staff-member';
import { ResultData } from '../../result-data';
import { map, tap } from 'rxjs/operators';
import { OfficeService } from 'src/app/core/services/office.service';
import { BaseEmail, EmailInfo } from '../../models/base-email';
import { EmailService } from 'src/app/core/services/email.service';
import { MessageService } from 'primeng/api';
import { WedgeValidators } from '../../wedge-validators';
@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
})
export class EmailComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() contactGroup: ContactGroup;
  @Input() person: Person;
  @Output() hideModal = new EventEmitter<boolean>();
  emailForm: FormGroup;
  searchForm: FormGroup;
  groupedPeople = [];
  groupedStaffMembers = [];
  currentStaffMember: StaffMember;
  isContactGroupFinderVisible = false;
  showButton = false;
  personOnly = false;
  personalEmails: { name: string; value: { personId: number; emailAddress: string }; isPreferred?: boolean }[] = [];
  existingPeople: Person[] = [];
  showFileUploader = false;
  uploadedFiles: any[] = [];
  public files: NgxFileDropEntry[] = [];
  searchPlaceholder = 'Property Address or Id';
  index = 0;
  isDocSelected = false;

  // Dummy Data
  documents: UploadDocument[] = [
    {
      fileName: '2345.html',
      description: 'Property List',
      type: 'Property Lettings',
      uploadBy: 'Emma Seckel',
      dateUploaded: '27/05/2015 13:14',
    },
    {
      fileName: '12345.docx',
      description: 'Instruction Letter',
      type: 'Property Sales',
      uploadBy: 'Emma Seckel',
      dateUploaded: '27/05/2015 13:14',
    },
    {
      fileName: '2345 00.docx',
      description: 'Property List',
      type: 'Property Lettings',
      uploadBy: 'Emma Seckel',
      dateUploaded: '27/05/2015 13:14',
    },
  ];

  propertyTypes: PropertyType[] = [
    { typeId: 2, type: 'Property Lettings', status: 'Let', statusDate: '27/05/2015' },
    { typeId: 3, type: 'Property Lettings', status: 'Let', statusDate: '27/05/2015' },
    { typeId: 4, type: 'Property Sales', status: 'WDN', statusDate: '27/05/2019' },
    { typeId: 5, type: 'Property Lettings', status: 'END', statusDate: '27/05/2020' },
  ];

  offers: BasicOffer[] = [{ offerId: 10, offeredBy: 'Emma Seckel', status: 'OA', statusDate: '09/05/2019' }];

  selectedDocuments: UploadDocument[] = [];
  isPropertySearch = true;
  suggestions = [];
  suggestionsDisplayName = 'propertyAddress';
  formErrors = FormErrors;

  private subs = new SubSink();
  staffMembers: StaffMember[] = [];
  offices: Office[];
  currentStaffMemberSignature: string;
  noEmailContact: boolean;
  isInvalidEmail: boolean;

  get attachments() {
    const total = this.selectedDocuments?.length + this.files?.length;
    return `Attachments (${total})`;
  }

  get recipientEmailControl(): FormControl {
    return this.emailForm.get('recipientEmail') as FormControl;
  }
  get ccExternalEmailControl(): FormControl {
    return this.emailForm.get('ccExternalEmail') as FormControl;
  }

  @ViewChild('pEditor') pEditor: any;
  constructor(
    private fb: FormBuilder,
    private storage: StorageMap,
    private officeService: OfficeService,
    public staffMemberService: StaffMemberService,
    private contactGroupService: ContactGroupsService,
    private messageService: MessageService,
    private propertyService: PropertyService,
    private validationService: ValidationService,
    private emailService: EmailService,
  ) {}

  ngOnInit(): void {
    this.getCurrentUserInfo();
    this.getActiveStaffMembers();
    this.getOffices();

    this.setupForm();
    this.populateForm();
    this.setupAttachmentForm();

    // Email form
    this.emailForm.valueChanges.subscribe(() => this.validationService.logValidationErrors(this.emailForm, false));

    // Attachment searches
    this.searchForm.get('searchType').valueChanges.subscribe((data) => {
      this.searchForm.get('searchTerm').setValue('');
      if (data === 'contact') {
        this.isPropertySearch = false;
        this.searchPlaceholder = 'Name, email or phone number';
      } else {
        this.isPropertySearch = true;
        this.searchPlaceholder = 'Property Address or Id';
      }
    });
  }

  private getCurrentUserInfo() {
    this.storage.get('currentUser').subscribe((data: StaffMember) => {
      if (data) {
        this.currentStaffMember = data;
      } else {
        this.staffMemberService.getCurrentStaffMember().subscribe((res) => (this.currentStaffMember = res));
      }
      this.emailForm.patchValue({ senderEmail: this.currentStaffMember?.email.toString() });
      // console.log('current user from storage in email....', this.currentStaffMember, 'form here', this.emailForm.value);
    });

    this.storage.get('signature').subscribe((data: string) => {
      if (data) {
        this.currentStaffMemberSignature = data;
      } else {
        this.staffMemberService
          .getCurrentStaffMemberSignature()
          .subscribe((res) => (this.currentStaffMemberSignature = res));
      }
      // console.log('current user signature from storage in email....', this.currentStaffMemberSignature);
    });
  }

  private setupForm() {
    this.emailForm = this.fb.group({
      senderEmail: [''],
      recipientEmail: ['', Validators.required],
      ccInternalEmail: [''],
      ccExternalEmail: [''],
      // ccExternalEmail: ['', [Validators.pattern(AppConstants.emailPattern)]],
      subject: ['', [Validators.required]],
      body: ['', Validators.required],
    });
  }

  private setupAttachmentForm() {
    this.searchForm = this.fb.group({
      searchType: ['property'],
      searchTerm: [''],
      propertyType: ['0'],
      offer: ['0'],
    });
  }

  ngOnChanges() {
    if (this.contactGroup) {
      this.getGroupedPeople(this.contactGroup.contactPeople);
    } else if (this.person) {
      this.personOnly = true;
      this.noEmailContact = !this.person.contactByEmail;
      this.person.emailAddresses.forEach((x) => {
        this.personalEmails.push({ name: x.email, value: { personId: this.person.personId, emailAddress: x.email } });
      });
      this.populateForm();
      // this.getGroupedPeople([], this.person);
    }
  }

  ngAfterViewInit() {
    const quill = this.pEditor?.getQuill();
    quill.setContents([{ insert: 'Dear ' }, { insert: '{{salutation}}' }, { insert: '\n\n\n' }]);
  }

  private populateForm() {
    if (this.person) {
      const preferredEmail = this.person.emailAddresses.find((x) => x.isPreferred)?.email;
      this.emailForm?.patchValue({ recipientEmail: [preferredEmail] });
    }
  }

  getActiveStaffMembers() {
    this.storage.get('activeStaffmembers').subscribe((data) => {
      if (data) {
        this.staffMembers = data as StaffMember[];
        this.getGroupedStaffMembers(this.staffMembers);
      } else {
        this.staffMemberService.getActiveStaffMembers().subscribe((res: ResultData) => {
          this.staffMembers = res.result;
          this.getGroupedStaffMembers(this.staffMembers);
        });
      }
    });
  }

  private getOffices() {
    this.storage.get('offices').subscribe((data) => {
      if (data) {
        this.offices = data as Office[];
      } else {
        this.officeService
          .getOffices()
          .pipe(
            (map((response) => response as ResultData),
            tap((res) => {
              if (res) {
                this.offices = res.result;
              }
            })),
          )
          .subscribe(); // Remove subscripton
      }
    });
  }

  getGroupedStaffMembers(staffMembers: StaffMember[]) {
    let officeMembers: lodash.Dictionary<StaffMember[]> | ArrayLike<StaffMember[]>;
    officeMembers = lodash.groupBy(staffMembers, (x) => x.activeDepartments[0]?.officeId);
    const groups = Object.values(officeMembers) as StaffMember[][];

    groups?.forEach((group) => {
      const item = {
        label: this.getOfficeName(group[0]?.activeDepartments[0]?.officeId),
        value: group[0]?.activeDepartments[0]?.officeId,
        items: this.getStaffEmails(group),
      };

      this.groupedStaffMembers = [...this.groupedStaffMembers, item];
    });
  }

  getGroupedPeople(people?: Person[], person?: Person) {
    this.groupedPeople = [];
    // if (person) {
    //   const item = { label: person.addressee, value: person.addressee, items: this.getEmails(person.emailAddresses) };
    //   this.groupedPeople.push(item);
    //   return;
    // }

    if (people)
      people.forEach((x) => {
        if (x) {
          const item = {
            label: x.addressee,
            value: x.addressee,
            items: this.getEmails(x.emailAddresses, x.personId),
          };
          this.groupedPeople.push(item);
        }
      });
  }

  getOfficeName(officeId: number) {
    return this.offices?.find((x) => x.officeId === officeId)?.name;
  }

  getStaffEmails(staffMembers: StaffMember[]) {
    const emails = [];
    staffMembers.forEach((x) =>
      emails.push({ name: x.fullName, value: { staffMemberId: x.staffMemberId, emailAddress: x.exchangeUsername } }),
    );
    return emails;
  }

  getEmails(emailAddresses: Email[], personId: number) {
    const emails = [];
    if (emailAddresses)
      emailAddresses.forEach((x) =>
        emails.push({
          name: x.email,
          value: { personId, contactId: this.contactGroup.contactGroupId, emailAddress: x.email } as EmailInfo,
          isPreferred: x.isPreferred,
        }),
      );
    // console.log({ emails });

    return emails;
  }

  validateMultipleEmails(event?: any) {
    // let email = event.value as string;
    if (!this.ccExternalEmailControl?.value?.length) {
      this.isInvalidEmail = false;
      return;
    }
    this.ccExternalEmailControl?.value?.forEach((email: string) => {
      email?.match(AppConstants.emailPattern) ? (this.isInvalidEmail = false) : (this.isInvalidEmail = true);
    });
  }

  onEmailAdded(event: any) {
    this.validateMultipleEmails(event);
  }
  onEmailRemoved(event: any) {
    this.validateMultipleEmails(event);
  }

  getSelectedContactGroup(group: ContactGroup) {
    this.personOnly = false;
    let people: Person[] = [];
    if (group) {
      this.isContactGroupFinderVisible = false;
      if (this.person) {
        this.existingPeople = this.existingPeople.concat(group.contactPeople);
        const allPeople = [...new Array(this.person, ...this.existingPeople)];
        people = lodash.uniqBy(allPeople, 'personId');
      } else {
        this.contactGroup.contactPeople = [...this.contactGroup.contactPeople, ...group.contactPeople];
        people = lodash.uniqBy(this.contactGroup.contactPeople, 'personId');
      }
      console.log({ people });

      this.getGroupedPeople(people);
    }
    // if (group) {
    //   this.isContactGroupFinderVisible = false;
    //   this.contactGroup.contactPeople = [...this.contactGroup.contactPeople, ...group.contactPeople];
    //   const people = lodash.uniqBy(this.contactGroup.contactPeople, 'personId');
    //   console.log({ people });

    //   this.getGroupedPeople(people);
    // }
  }

  // Search Form

  getSuggestions(event) {
    if (this.isPropertySearch) {
      this.getProperties(event.query);
    } else {
      this.suggestionsDisplayName = 'contactNames';
      this.contactGroupService.getAutocompleteSigners(event?.query).subscribe((result) => {
        this.suggestions = result;
      });
    }
  }

  getProperties(searchTerm: string) {
    this.suggestionsDisplayName = 'propertyAddress';
    const requestOptions = {
      // page: page,
      // pageSize: this.PAGE_SIZE,
      searchTerm: searchTerm,
    } as RequestOption;
    this.propertyService.autocompleteProperties(requestOptions).subscribe((result) => {
      this.suggestions = result;
    });
  }

  search() {
    console.log(this.searchForm?.value);
  }

  clear() {
    this.searchForm?.reset();
    // this.setupAttachmentForm();
  }

  // Uploading files
  onUpload(event) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }

  public dropped(files: NgxFileDropEntry[]) {
    const newFiles = [...this.files, ...files];
    this.files = lodash.uniqBy(newFiles, 'relativePath');

    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

          /**
          // You could upload it like this:
          const formData = new FormData()
          formData.append('logo', file, relativePath)

          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })

          this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          .subscribe(data => {
            // Sanitized logo returned from backend
          })
          **/
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
        console.log('folders herell...');
      }
    }
  }

  removeFile(file: File, index: number) {
    this.files?.splice(index, 1);
  }

  selectDocument(doc: UploadDocument, index: number) {
    doc?.isSelected ? (this.documents[index].isSelected = false) : (this.documents[index].isSelected = true);

    this.getSelectedDocuments(this.documents);
  }

  removeDocument(event: any, index: number) {
    this.documents[index].isSelected = false;
    this.getSelectedDocuments(this.documents);
  }

  getSelectedDocuments(docs: UploadDocument[]) {
    this.selectedDocuments = docs.filter((x) => x.isSelected);
  }

  send() {
    this.index = 0; // Switch to message details tab
    this.validationService.logValidationErrors(this.emailForm, true);
    this.validateMultipleEmails();
    if (this.emailForm.invalid) {
      return;
    }
    if (this.emailForm.dirty) {
      const email = { ...this.emailForm.value } as BaseEmail;
      if (this.person) {
        const recipientEmail = [];
        recipientEmail.push({
          personId: this.person.personId,
          emailAddress: this.recipientEmailControl?.value[0],
        } as EmailInfo);
        email.recipientEmail = recipientEmail;
        console.log(this.emailForm?.value, 'send email form', { email });
      }
      this.emailService.sendEmail(email).subscribe((res) => {
        this.onSavecomplete(res), console.log({ res });
      });
    }
  }

  onSavecomplete(isSaved?: boolean) {
    if (isSaved) {
      this.messageService.add({ severity: 'success', summary: 'Email successfully sent', closable: false });
      this.hideModal.emit();
    }
  }

  cancel() {
    // this.emailForm?.reset();
    this.hideModal.emit();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.validationService.clearFormValidators(this.emailForm, this.formErrors);
  }
}

export interface UploadDocument {
  fileName: string;
  description: string;
  type: string;
  uploadBy: string;
  dateUploaded: string;
  isSelected?: boolean;
}

export interface PropertyType {
  typeId: number;
  type?: string;
  status?: string;
  statusDate?: string;
}

export interface BasicOffer {
  offerId: number;
  offeredBy?: string;
  status?: string;
  statusDate?: string;
}
