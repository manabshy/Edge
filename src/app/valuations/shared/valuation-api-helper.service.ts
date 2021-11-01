import { HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ValuationRequestOption, ValuersAvailabilityOption } from './valuation'
import { CustomQueryEncoderHelper } from 'src/app/core/shared/custom-query-encoder-helper'

@Injectable({
  providedIn: 'root'
})
export class ValuationApiHelperService {
  public setAvailabilityQueryParams(requestOption: ValuersAvailabilityOption) {
    if (!requestOption.page) {
      requestOption.page = 1
    }
    if (requestOption.pageSize == null) {
      requestOption.pageSize = 10
    }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper(),
      fromObject: {
        pageSize: requestOption.pageSize.toString(),
        page: requestOption.page.toString(),
        fromDate: requestOption.fromDate ? requestOption.fromDate.toString() : '',
        staffMemberId1: requestOption.salesValuerId ? requestOption.salesValuerId.toString() : '0',
        staffMemberId2: requestOption.lettingsValuerId ? requestOption.lettingsValuerId.toString() : '0'
      }
    })
    return options
  }

  public setQueryParams(requestOption: ValuationRequestOption) {
    console.log('requestOption.status: ', requestOption.status)
    if (!requestOption.page) {
      requestOption.page = 1
    }
    if (requestOption.pageSize == null) {
      requestOption.pageSize = 20
    }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper(),
      fromObject: {
        searchTerm: requestOption.searchTerm,
        pageSize: requestOption.pageSize.toString(),
        page: requestOption.page.toString(),
        date: requestOption.date ? requestOption.date.toString() : '',
        status: requestOption.status.toString(),
        valuerId: requestOption.valuerId.toString(),
        officeId: requestOption.officeId.toString()
      }
    })
    return options
  }
}
