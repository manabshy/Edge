import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { AppConstants } from 'src/app/core/shared/app-constants'
import { ApiHelperService } from 'src/app/shared/api-helper.service'

import { InstructionRequestOption, InstructionStatus, InstructionViewingAndMarketingStatus } from './instructions.interfaces'

@Injectable({
  providedIn: 'root'
})
export class InstructionsService {

  constructor(private http: HttpClient, private helperSvc: ApiHelperService) {}

  public getInstructions(request: InstructionRequestOption): Observable<any[] | any> {
    const options = this.helperSvc.setQueryParamsForInstructions(request)
    const url = `${AppConstants.baseInstructionUrl}/search`
    return this.http
      .get<any>(url, { params: options })
      .pipe(
        map((response) => response.result.map((i) => {
          return {
            ...i,
            instructionDate: new Date(i.instructionDate),
            lister: i.instructionLister,
            status: InstructionStatus.instructed,
            address: i.propertyAddress.replace(/(?:\\[rn]|[\r\n]+)+/g, ", "),
            instructionId: i.propertyEventId,
            owner: i.propertyOwner,
            viewingStatus: InstructionViewingAndMarketingStatus.stopped,
            marketingStatus: InstructionViewingAndMarketingStatus.stopped      
          }
        })),
      )
  }
}
