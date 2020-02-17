import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Office } from '../models/staff-member';
import { StorageMap } from '@ngx-pwa/local-storage';
import { OfficeService } from 'src/app/core/services/office.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-office-finder',
  templateUrl: './office-finder.component.html',
  styleUrls: ['./office-finder.component.scss']
})
export class OfficeFinderComponent implements OnInit {
  @Input() officeId: number;
  @Output() selectedOfficeId = new EventEmitter<number>();
  offices$ = new Observable<Office[]>();

  constructor(private officeService: OfficeService, private storage: StorageMap) { }

  ngOnInit(): void {
    this.storage.get('offices').subscribe(data => {
      if (data) {
        this.offices$ = of(data as Office[]);
      } else {
        this.offices$ = this.officeService.getOffices().pipe((map(res => res)));
      }
    });
  }

  onOfficeChange(office: Office) {
    console.log('selected office', office);
    this.selectedOfficeId.emit(office.officeId);
  }
}
