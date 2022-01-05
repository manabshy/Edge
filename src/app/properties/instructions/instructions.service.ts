import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { AppConstants } from 'src/app/core/shared/app-constants'
import { ApiHelperService } from 'src/app/shared/api-helper.service'
import { StaffMemberService } from 'src/app/core/services/staff-member.service'
import { OfficeService } from 'src/app/core/services/office.service'
import {
  InstructionRequestOption,
  InstructionsTableType,
  InstructionStatusForSalesAndLettingsEnum
} from './instructions.interfaces'
import { statusesForSalesAndLettingsSearch } from './instructions.store.helper-functions'

export interface GetInstructionsApiResponse {
  instructionLister: string
  instructionStatus: string
  propertyAddress: string
  propertyEventId: string
  propertyOwner: string
  viewingStatus: string
  marketingStatus: string
  instructionDate: Date
}

export interface InstructionsSearchSuggestionsResponse {}

@Injectable({
  providedIn: 'root'
})
export class InstructionsService {
  InstructionStatusForSalesAndLettingsEnum = InstructionStatusForSalesAndLettingsEnum

  selectControlOptions = {
    statusesForSelect: [],
    officesForSelect: [],
    listersForSelect: []
  }

  constructor(
    private http: HttpClient,
    private helperSvc: ApiHelperService,

    private staffMemberService: StaffMemberService,
    private officeService: OfficeService
  ) {}

  async getSelectControlOptions() {
    this.selectControlOptions.statusesForSelect = statusesForSalesAndLettingsSearch()
    await this.getOffices()
    await this.getListers()
    return await Promise.resolve(this.selectControlOptions)
  }

  public getInstructions(request: InstructionRequestOption): Observable<any[] | any> {
    const options = this.helperSvc.setQueryParamsForInstructions(request)
    const url = `${AppConstants.baseInstructionUrl}/search`

    return this.http.get<any>(url, { params: options }).pipe(
      map((response: any) =>
        response.result.map((i: GetInstructionsApiResponse) => {
          return {
            ...i,
            instructionDate: new Date(i.instructionDate),
            lister: i.instructionLister,
            status: i.instructionStatus,
            address: i.propertyAddress,
            instructionId: i.propertyEventId,
            owner: i.propertyOwner,
            viewingStatus: i.viewingStatus,
            marketingStatus: i.marketingStatus
          }
        })
      )
    )
  }

  public getInstructionsSuggestions(searchTerm, departmentType): Observable<any> {
    if (departmentType === InstructionsTableType.SALES_AND_LETTINGS) {
      departmentType = ''
    }
    console.log('getInstructionsSuggestions searchTerm: ', searchTerm)
    console.log('getInstructionsSuggestions departmentType: ', departmentType)
    const url = `${AppConstants.baseInstructionUrl}/suggestions?SearchTerm=${searchTerm}&DepartmentType=${departmentType}`

    return this.http
      .get<any>(url, {
        headers: { ignoreLoadingBar: '' }
      })
      .pipe(map((response: any) => response.result))
  }

  private getOffices() {
    return Promise.resolve(
      this.officeService
        .getOffices()
        .toPromise()
        .then((res) => {
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
    return Promise.resolve(
      this.staffMemberService
        .getActiveStaffMembers()
        .toPromise()
        .then((res) => {
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
