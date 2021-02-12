import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageMap } from '@ngx-pwa/local-storage';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { ContactGroup } from 'src/app/contactgroups/shared/contact-group';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { Email, Person } from '../../models/person';
import { StaffMember } from '../../models/staff-member';
import lodash from 'lodash';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit, OnChanges {
  @Input() contactGroup: ContactGroup;
  @Input() person: Person;
  @Output() hideModal = new EventEmitter<boolean>();
  emailForm: FormGroup;
  groupedPeople = [];
  currentStaffMember: StaffMember;
  isContactGroupFinderVisible = false;
  showButton = false;
  personOnly = false;
  personalEmails: { name: string, value: string }[] = [];
  existingPeople: Person[] = [];
  showFileUploader = false;
  uploadedFiles: any[] = [];
  public files: NgxFileDropEntry[] = [];
  searchPlaceholder = 'Property Address or Id';
  propertyTypes = [];
  offers = [];
  isDocSelected = false;
  documents: UploadDocument[] = [
    { fileName: '2345.html', description: 'Property List', type: 'Property Lettings', uploadBy: 'Emma Seckel', dateUploaded: '27/05/2015 13:14' },
    { fileName: '12345.docx', description: 'Instruction Letter', type: 'Property Sales', uploadBy: 'Emma Seckel', dateUploaded: '27/05/2015 13:14' },
    { fileName: '2345 00.docx', description: 'Property List', type: 'Property Lettings', uploadBy: 'Emma Seckel', dateUploaded: '27/05/2015 13:14' },
  ];

  selectedDocuments: UploadDocument[] = [];
  constructor(private fb: FormBuilder, private storage: StorageMap,
    public staffMemberService: StaffMemberService) { }

  ngOnInit(): void {
    this.storage.get('currentUser').subscribe((data: StaffMember) => {
      if (data) {
        this.currentStaffMember = data;
      } else {
        this.staffMemberService.getCurrentStaffMember().subscribe(res => this.currentStaffMember = res);
      }
      console.log('current user from storage in email....', this.currentStaffMember);
    });

    this.setupForm();
    this.populateForm();
  }

  private setupForm() {
    this.emailForm = this.fb.group(({
      senderEmail: [this?.currentStaffMember?.email],
      recipientEmail: ['', Validators.required],
      ccInternalEmail: [''],
      ccExternalEmail: [''],
      subject: [''],
      body: ['', Validators.required]
    }));
  }

  ngOnChanges() {
    if (this.contactGroup) {
      console.log(this.contactGroup, 'group');
      this.getGroupedPeople(this.contactGroup.contactPeople);

    } else if (this.person) {
      this.personOnly = true;
      this.person.emailAddresses.forEach(x => {
        this.personalEmails.push({ name: x.email, value: x.email });
      });
      this.populateForm();
      // this.getGroupedPeople([], this.person);
    }
  }

  private populateForm() {
    if (this.person) {
      const preferredEmail = this.person.emailAddresses.find(x => x.isPreferred)?.email;
      this.emailForm?.patchValue({ recipientEmail: [preferredEmail] });
      console.log(this.emailForm?.value, 'Email form');
      console.log('person', this.person);
    }
  }

  getGroupedPeople(people?: Person[], person?: Person) {
    this.groupedPeople = [];
    // if (person) {
    //   const item = { label: person.addressee, value: person.addressee, items: this.getEmails(person.emailAddresses) };
    //   this.groupedPeople.push(item);
    //   return;
    // }
    people?.forEach(x => {
      const item = { label: x.addressee, value: x.addressee, items: this.getEmails(x.emailAddresses) };
      this.groupedPeople.push(item);
      console.log('group', this.groupedPeople);
    });
  }

  getEmails(emailAddresses: Email[]) {
    const emails = [];
    emailAddresses.forEach(x => emails.push({ name: x.email, value: x.email }));
    return emails;
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

  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  public fileOver(event){
    console.log(event);
  }

  public fileLeave(event){
    console.log(event);
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
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
      }
    }
  }

  removeFile(file:any){
    console.log({file}, 'to be removed');

  }

  selectDocument(doc: UploadDocument) {
    console.log({ doc });
    const index = this.documents.findIndex(x => x.fileName === doc.fileName);
    doc?.isSelected ? this.documents[index].isSelected = false : this.documents[index].isSelected = true;

    this.getSelectedDocuments(this.documents);
    // this.isDocSelected = !this.isDocSelected;
  }

  removeDocument(doc: any) {
    console.log({ doc }, 'removed');
    console.log(this.selectedDocuments, 'remainging');


  }
  getSelectedDocuments(docs: UploadDocument[]) {
    this.selectedDocuments = docs.filter(x => x.isSelected);
  }
  send() {
    console.log(this.emailForm?.value, 'send email form');
  }

  cancel() {
    // this.emailForm?.reset();
    this.hideModal.emit();
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