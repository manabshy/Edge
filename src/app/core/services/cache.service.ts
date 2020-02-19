import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { HttpClient } from '@angular/common/http';
import { CacheStatus, ResultData } from 'src/app/shared/result-data';
import { InfoService } from './info.service';
import { OfficeService } from './office.service';
import { StaffMemberService } from './staff-member.service';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor(private infoService: InfoService,
    private officeService: OfficeService,
    private staffMemberService: StaffMemberService,
    private storage: StorageMap) { }

  invalidateCache(response?: ResultData | any) {
    let cache: CacheStatus;
    if (response) {
      cache = response.cacheStatus;
      this.setCacheStatus(cache);
      // console.log('cache status from response', cache);

      this.storage.get('cacheStatus').subscribe((result: CacheStatus) => {
        // console.log('existing cache status here..', result);
        if (result && cache) {
          if (result.info !== cache.info) {
            this.storage.delete('info').subscribe();
            this.infoService.getDropdownListInfo().subscribe();
          }
          if (result.offices !== cache.offices) {
            this.storage.delete('offices').subscribe();
            this.officeService.getOffices().subscribe();
          }
          if (result.staffMembers !== cache.staffMembers) {
            this.storage.delete('allstaffmembers').subscribe();
            this.staffMemberService.getAllStaffMembers().subscribe();
          }
        }
      });
      // switch (true) {
      //   case !!cache.info:
      //     this.invalidateInfoCache(cache.info);
      //     break;
      //   case !!cache.offices:
      //     this.invalidateOfficesCache(cache.offices)
      //     break;
      //   case !!cache.staffMembers:
      //     this.invalidateStaffMembersCache(cache.staffMembers)
      //     break;
      // }
    }
  }

  setCacheStatus(cacheStatus: CacheStatus) {
    this.storage.has('cacheStatus').subscribe(hasKey => {
      if (!hasKey) {
        this.storage.set('cacheStatus', cacheStatus).subscribe();
      }
    });
  }
}
