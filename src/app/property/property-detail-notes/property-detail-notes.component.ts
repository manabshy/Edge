import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../shared/property.service';
import { ActivatedRoute } from '@angular/router';
import { PropertyNote } from '../shared/property';
import { SharedService } from 'src/app/core/services/shared.service';
import * as _ from 'lodash';
import { BaseComponent } from 'src/app/core/models/base-component';
import { takeUntil } from 'rxjs/operators';
import { AppUtils } from 'src/app/core/shared/utils';
import { InfoService } from 'src/app/core/services/info.service';
import { StorageMap } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-property-detail-notes',
  templateUrl: './property-detail-notes.component.html',
  styleUrls: ['./property-detail-notes.component.scss']
})
export class PropertyDetailNotesComponent extends BaseComponent implements OnInit {
  propertyId: number;
  propertyNotes: PropertyNote[] = [];
  page = 1;
  pageSize = 10;
  bottomReached = false;
  noteTypes: any;
  listInfo: any;
  navPlaceholder: string;

  constructor(private route: ActivatedRoute,
    private propertyService: PropertyService,
    private sharedService: SharedService,
    private storage: StorageMap,
    private infoService: InfoService) { super(); }

  ngOnInit() {
    this.navPlaceholder = AppUtils.navPlaceholder;
    this.storage.get('info').subscribe(data => {
      if (data) {
        this.listInfo = data;
        console.log('list info property notes....', this.listInfo);
      }
    });

    this.propertyId = +this.route.snapshot.paramMap.get('id') || 0;
    if (this.propertyId) {
      this.getPropertyNotes();
    }

    this.propertyService.propertyNotePageNumberChanges$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(newPage => {
      this.page = newPage;
      this.getNexPropertyNotesPage(this.page);
    });

    this.propertyService.propertyNoteChanges$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      if (data) {
        this.propertyNotes = [];
        this.page = 1;
        this.bottomReached = false;
        this.getPropertyNotes();
      }
    });
  }

  private getPropertyNotes() {
    this.getNexPropertyNotesPage(this.page);
  }

  private getNexPropertyNotesPage(page) {
    this.propertyService.getPropertyNotes(this.propertyId, this.pageSize, page)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        if (data && data.length) {
          this.propertyNotes = _.concat(this.propertyNotes, data);
          this.setupNoteType();
        }
        if (data && !data.length) {
          this.bottomReached = true;
        }
      });
  }

  setupNoteType() {
    if(this.listInfo) {
      this.noteTypes = this.listInfo.propertyNoteTypes;
    }
    const keys = Object.keys(this.noteTypes);
    console.log(this.noteTypes);
    if (this.propertyNotes) {
      this.propertyNotes.forEach((note: PropertyNote) => {
        if (this.noteTypes) {
          keys.forEach(key => {
            if (+key === +note.type) {
              note.typeDescription = _.startCase(this.noteTypes[+key]);
              // note.typeDescription = this.noteTypes[+key];
            }
          });
        }
      });
    }
  }

  addNote() {
    event.stopPropagation();
    const data = {
      propertyId: this.propertyId,
    };
    console.log('for notes', data);
    this.sharedService.addNote(data);
  }
}
