import { InstructionsTableType } from './instructions.interfaces'
import { InstructionStatusForSalesAndLettings, InstructionStatusForSales, InstructionStatusForLettings } from './instructions.interfaces'

export const splitSalesAndLettingsStatuses = (request) => {

  const updatedRequest = {
    ...request,
    salesStatus:
      request.departmentType === InstructionsTableType.SALES_AND_LETTINGS ||
      request.departmentType === InstructionsTableType.SALES
        ? request.status.filter((status) => {
            const permittedStatusesForSales = [
              // 'notSet',
              'valued',
              'instructed',
              'underOffer',
              'underOfferOtherAgent',
              'exchanged',
              'completed',
              'withdrawn',
              'lapsed'
            ]
            return permittedStatusesForSales.includes(status)
          })
        : '',
    lettingsStatus:
      request.departmentType === InstructionsTableType.SALES_AND_LETTINGS ||
      request.departmentType === InstructionsTableType.LETTINGS
        ? request.status.filter((status) => {
            const permittedStatusesForLettings = [
              'notOnMarket',
              'valued',
              'instructed',
              'underOffer',
              'exchanged',
              'let',
              'end',
              'withdrawn',
              'lapsed'
            ]
            return permittedStatusesForLettings.includes(status)
          })
        : ''
  }
  if (updatedRequest.departmentType === InstructionsTableType.SALES_AND_LETTINGS) updatedRequest.departmentType = ''
  console.log('updatedRequest after splitting sales and lettings statuses ', updatedRequest)
  return updatedRequest
}


/***
 * drives the options in the status dropdown on Instructions search component
 */
export const statusesForSalesAndLettingsSearch = (): any[] => {
  return Object.keys(InstructionStatusForSalesAndLettings).map((statusVal, ix) => {
    return {
      id: statusVal,
      value: InstructionStatusForSalesAndLettings[statusVal]
    }
  })
}
export const statusesForLettingsSearch = (): any[] => {
  return Object.keys(InstructionStatusForLettings).map((statusVal, ix) => {
    return {
      id: statusVal,
      value: InstructionStatusForLettings[statusVal]
    }
  })
}
export const statusesForSalesSearch = (): any[] => {
  return Object.keys(InstructionStatusForSales).map((statusVal, ix) => {
    return {
      id: statusVal,
      value: InstructionStatusForSales[statusVal]
    }
  })
}