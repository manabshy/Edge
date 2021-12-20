import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { AppConstants } from 'src/app/core/shared/app-constants'
import { ApiHelperService } from 'src/app/shared/api-helper.service'

import {
  InstructionRequestOption,
  InstructionStatus,
  InstructionViewingAndMarketingStatus
} from './instructions.interfaces'

@Injectable({
  providedIn: 'root'
})
export class InstructionsService {
  constructor(private http: HttpClient, private helperSvc: ApiHelperService) {}

  public getInstructions(request: InstructionRequestOption): Observable<any[] | any> {
    const options = this.helperSvc.setQueryParamsForInstructions(request)
    const url = `${AppConstants.baseInstructionUrl}/search`

    return this.http.get<any>(url, { params: options }).pipe(
      map((response) =>
        response.result.map((i) => {
          /***
           * mapping API response to client model
           *instructionDate: "2009-10-12T12:36:17.11+01:00"
            instructionLister: "Emma Seckel"
            instructionStatus: "End"
            longLetPrice: 275
            marketingPrice: null
            propertyAddress: "C, 47, Rosenau Road, London, SW11 4QX"
            propertyEventId: 33237
            propertyOwner: "Mr Colm McDermott"
            queryResultCount: 39369
            shortLetPrice: 0
           */
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
}
