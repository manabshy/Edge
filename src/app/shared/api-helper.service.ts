import { HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ValuationRequestOption, ValuersAvailabilityOption } from '../valuations/shared/valuation'
import { CustomQueryEncoderHelper } from 'src/app/core/shared/custom-query-encoder-helper'
import { InstructionRequestOption, InstructionsTableType } from '../properties/instructions/instructions.interfaces'

@Injectable({
  providedIn: 'root'
})
export class ApiHelperService {
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

  public setQueryParamsForInstructions(requestOption: InstructionRequestOption) {
    if (!requestOption.page) {
      requestOption.page = 1
    }
    if (requestOption.pageSize == null) {
      requestOption.pageSize = 20
    }
    if (requestOption.departmentType === InstructionsTableType.SALES_AND_LETTINGS) {
      requestOption.departmentType = ''
    }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper(),
      fromObject: {
        searchTerm: requestOption.searchTerm,
        salesStatus: requestOption.salesStatus.toString(),
        lettingsStatus: requestOption.lettingsStatus.toString(),
        departmentType: requestOption.departmentType.toString(),
        dateFrom: requestOption.dateFrom ? requestOption.dateFrom.toString() : '',
        pageSize: requestOption.pageSize.toString(),
        page: requestOption.page.toString(),
        valuerId: requestOption.valuerId ? requestOption.valuerId.toString() : '',
        officeId: requestOption.officeId ? requestOption.officeId.toString() : '',
        orderBy: requestOption.orderBy.toString()
      }
    })
    return options
  }
}
