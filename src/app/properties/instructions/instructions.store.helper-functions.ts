import { InstructionsTableType } from './instructions.interfaces'

export const splitSalesAndLettingsStatuses = (request) => {
  // console.log('request: ', request)
  const updatedRequest = {
    ...request,
    salesStatus:
      request.departmentType === InstructionsTableType.SALES_AND_LETTINGS ||
      request.departmentType === InstructionsTableType.SALES
        ? request.status.filter((status) => {
            const permittedStatusesForSales = [
              'notSet',
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
              'notSet',
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
  // console.log('updatedRequest ', updatedRequest)
  return updatedRequest
}
