import { Component, OnInit, Input, OnChanges, HostListener, Output, EventEmitter, OnDestroy } from '@angular/core'
import { ContactNote, BasicContactGroup, NoteType, JobTypes } from 'src/app/contact-groups/shared/contact-group'
import { SharedService } from 'src/app/core/services/shared.service'
import { ContactGroupsService } from 'src/app/contact-groups/shared/contact-groups.service'
import { Person } from '../models/person'
import { PropertyNote } from 'src/app/property/shared/property'
import { PropertyService } from 'src/app/property/shared/property.service'
import { StaffMember } from '../models/staff-member'
import { StorageMap } from '@ngx-pwa/local-storage'
import { Router } from '@angular/router'
import { EmailService } from 'src/app/core/services/email.service'

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() personId: number
  @Input() noteData: any
  @Input() personNotesData: any
  @Input() pageNumber: number
  @Input() bottomReached: boolean
  @Input() addressees: any
  @Input() person: Person
  @Input() personNotes: ContactNote[]
  @Input() contactGroupNotes: ContactNote[]
  @Input() propertyNotes: PropertyNote[]
  @Input() showNoteInput = true
  @Input() showNoteFilter = false

  @Output() showMyNotes = new EventEmitter<boolean>()

  notes = []
  tests: any
  contactPeople: Person[]
  contact: Person[]
  contactGroupIds: number[] = []
  groupAddressee: any
  addressee: any
  order = ['isPinned', 'createDate']
  reverse = true
  page: number
  notesLength: number
  isPropertyNote: boolean
  isPersonNote: boolean
  isUpdating: boolean
  currentStaffMember: StaffMember
  showNotesForm = false
  @Input() showCreateNoteButton = true
  emailBody: any
  showMoreLabel = 'SHOW MORE'
  toggleShowMoreLabel = false
  jobTypes = JobTypes
  constructor(
    private sharedService: SharedService,
    private contactGroupService: ContactGroupsService,
    private storage: StorageMap,
    private router: Router,
    private propertyService: PropertyService,
    private emailService: EmailService
  ) {}

  ngOnInit() {
    this.storage.get('currentUser').subscribe((staffMember: StaffMember) => {
      if (staffMember) {
        this.currentStaffMember = staffMember
      }
    })
  }

  ngOnChanges() {
    this.init()
  }

  init() {
    this.notes = this.personNotes || this.contactGroupNotes || this.propertyNotes
    this.setJobTypeName(this.notes)
    console.log(this.notes, 'notes all')
    this.page = this.pageNumber
    if (this.noteData) {
      this.noteData.people !== undefined ? (this.contactPeople = this.noteData.people) : (this.contactPeople = [])
      this.noteData.group ? (this.groupAddressee = this.noteData.group.addressee) : (this.groupAddressee = [])
    }
    if (this.propertyNotes) {
      this.showCreateNoteButton = false
      this.propertyNotes.filter((x) => x.text) ? (this.isPropertyNote = true) : (this.isPropertyNote = false)
    }
    if (this.personNotes) {
      this.personNotes.filter((x) => x.text) ? (this.isPersonNote = true) : (this.isPersonNote = false)
    }
  }
  setJobTypeName(notes: any[]) {
    notes.forEach((n) => {
      n.jobTypeName = this.jobTypes.get(n.jobType)
    })
  }
  setFlag(noteId: number, isImportantFlag: boolean) {
    this.notes.forEach((x) => {
      if (+x.id === noteId) {
        if (isImportantFlag) {
          x.isImportant ? (x.isImportant = false) : (x.isImportant = true)
        } else {
          x.isPinned ? (x.isPinned = false) : (x.isPinned = true)
        }

        switch (true) {
          case !!x.contactGroupId:
            this.contactGroupService.updateContactGroupNote(x).subscribe((data) => {
              this.contactGroupService.notesChanged(x)
            })
            break
          case !!x.personId:
            this.contactGroupService.updatePersonNote(x).subscribe((data) => {
              this.contactGroupService.notesChanged(x)
            })
            break
          case !!x.propertyId:
            this.propertyService.updatePropertyNote(x).subscribe((data) => {
              this.propertyService.propertyNoteChanged(x)
            })
            break
        }
      }
    })

    if (this.notes.filter((x) => x.propertyId)) {
      return
    }
  }

  getClassName(jobType: number) {
    const className = 'warning--light'
    if (jobType === 1) {
      return 'positive--light'
    }
    if (jobType === 2) {
      return 'blossom--light'
    }
    if (jobType === 3) {
      return 'info--light'
    }
    return className
  }

  onScrollDown() {
    if (!this.bottomReached) {
      this.page++
      console.log('here for id page number in notes', this.page)
      this.setNewContactNotePageNumber()
      this.setNewPersonNotePageNumber()
      this.setNewPropertyNotePageNumber()
    }
  }

  onScrollUp() {}

  private setNewPropertyNotePageNumber() {
    if (this.isPropertyNote) {
      this.propertyService.propertyNotePageNumberChanged(this.page)
      console.log('in property notes..........', this.propertyNotes)
    }
  }

  private setNewPersonNotePageNumber() {
    if (this.isPersonNote) {
      this.contactGroupService.personNotePageNumberChanged(this.page)
      console.log('in person notes..........', this.personNotes)
    }
  }

  private setNewContactNotePageNumber() {
    if (this.contactPeople && this.contactPeople.length) {
      this.contactGroupService.contactNotePageNumberChanged(this.page)
      console.log('in contact notes..........', this.contactGroupNotes)
    }
  }

  addNote() {
    if (this.noteData) {
      this.sharedService.addNote(this.noteData)
    }
  }

  toggleNoteCreation() {
    this.showNotesForm = !this.showNotesForm
    this.showCreateNoteButton = false
  }

  toggleShowMyNotes(event: boolean) {
    this.showMyNotes.emit(event)
  }

  noteSaved() {
    this.showCreateNoteButton = true
    this.showNotesForm = false
  }

  getEmailBody(note: ContactNote) {
    console.log({ note })
    note.hasEmailBody
      ? (this.notes.find((x) => +x.id === note.id).hasEmailBody = false)
      : (this.notes.find((x) => +x.id === note.id).hasEmailBody = true)
    console.log(this.notes, 'new notes with flag')

    if (!note?.emailBody) {
      this.emailService.getEmailForNotes(note.id).subscribe((res) => {
        this.emailBody = res
        note.emailBody = res
      })
    }
  }

  ngOnDestroy() {
    this.notes = []
  }
}
