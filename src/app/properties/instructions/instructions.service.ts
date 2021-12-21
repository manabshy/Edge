import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { AppConstants } from 'src/app/core/shared/app-constants'
import { ApiHelperService } from 'src/app/shared/api-helper.service'
import { StaffMemberService } from 'src/app/core/services/staff-member.service'
import { OfficeService } from 'src/app/core/services/office.service'
import {
  InstructionRequestOption,
  InstructionStatus,
  InstructionViewingAndMarketingStatus
} from './instructions.interfaces'
import { StorageMap } from '@ngx-pwa/local-storage'

@Injectable({
  providedIn: 'root'
})
export class InstructionsService {
  instructionStatus = InstructionStatus

  selectControlOptions = {
    statusesForSelect: [],
    officesForSelect: [],
    listersForSelect: []
  }

  constructor(
    private http: HttpClient,
    private helperSvc: ApiHelperService,
    private storage: StorageMap,
    private staffMemberService: StaffMemberService,
    private officeService: OfficeService
  ) {}

  async getSelectControlOptions() {
    console.log('getSelectControlOptions start')
    this.getStatuses()
    await this.getOffices()
    await this.getListers()
    console.log('getSelectControlOptions end')
    return await Promise.resolve(this.selectControlOptions)
  }

  public getInstructions(request: InstructionRequestOption): Observable<any[] | any> {
    const options = this.helperSvc.setQueryParamsForInstructions(request)
    const url = `${AppConstants.baseInstructionUrl}/search`

    return this.http.get<any>(url, { params: options }).pipe(
      map((response) =>
        response.result.map((i) => {
          return {
            ...i,
            instructionDate: new Date(i.instructionDate),
            lister: i.instructionLister,
            status: i.instructionStatus,
            address: i.propertyAddress,
            instructionId: i.propertyEventId,
            owner: i.propertyOwner,
            viewingStatus: InstructionViewingAndMarketingStatus.stopped,
            marketingStatus: InstructionViewingAndMarketingStatus.stopped
          }
        })
      )
    )
  }

  public getInstructionsSuggestions(searchTerm, departmentType): Observable<any> {
    const url = `${AppConstants.baseInstructionUrl}/suggestions?SearchTerm=${searchTerm}&DepartmentType=${departmentType}`

    return this.http
      .get<any>(url, {
        headers: { ignoreLoadingBar: '' }
      })
      .pipe(map((response) => response.result))
  }

  private getStatuses() {
    this.selectControlOptions.statusesForSelect = Object.keys(this.instructionStatus).map((statusVal, ix) => {
      return {
        id: statusVal,
        value: this.instructionStatus[statusVal]
      }
    })
  }

  private getOffices() {
    console.log('getOffices...')
    return Promise.resolve(
      this.officeService
        .getOffices()
        .toPromise()
        .then((res) => {
          console.log('getOffices...res ', res)
          this.selectControlOptions.officesForSelect = res.result.map((office) => {
            return {
              id: office.officeId,
              value: office.name
            }
          })
        })
    )
  }

  private getListers() {
    console.log('getListers...')
    return Promise.resolve(
      this.staffMemberService
        .getActiveStaffMembers()
        .toPromise()
        .then((res) => {
          console.log('getListers got from API...', res)
          this.selectControlOptions.listersForSelect = res.result.map((lister) => {
            return {
              id: lister.staffMemberId,
              value: lister.fullName
            }
          })
        })
    )
  }
}
