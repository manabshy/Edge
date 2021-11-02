import { ValuationTypeEnum } from '../shared/valuation'
import { mapDocumentsForView } from './helpers/store-documents-helpers'

/***
 * @function buildPartialLoadState
 * @param {string} companyId - ID of the company associated with a valuation
 * @param {Object} valuationData: Object
 * @description Builds initial store state when a compliance state is initializing
 * @returns Object containing properties for the compliance checks store
 */
export const buildPartialLoadState = (companyId, valuationData) => {
  console.log('valuationData.complianceCheck: ', valuationData.complianceCheck)
  return {
    contactGroupId: valuationData.propertyOwner?.contactGroupId,
    companyOrContact: companyId ? 'company' : 'contact',
    checkType: identifyAmlOrKyc(valuationData),
    compliancePassedBy: valuationData.complianceCheck?.compliancePassedByFullName,
    compliancePassedDate: valuationData.complianceCheck?.compliancePassedDate,
    valuationEventId: valuationData.valuationEventId,
    companyId: companyId,
    isFrozen: valuationData.complianceCheck?.compliancePassedDate ? true : false
  }
}

/***
 * @function setContactsForCompliance
 * @param {Object[]} entitites
 * @param {string} passedDate - date the valuation was passed. Temporarirly using this since individual compliance passed dates are not being set to null when docs are refreshed. Fixes Bug 2973
 * @description Builds entities array for store mapping from API shape to Store shape. Any API props for entities that need changing look here first
 */
export const setContactsForCompliance = (entitites, passedDate) => {
  // console.log('RAW PEOPLE FROM API: ', entitites)
  return entitites.map((e) => {
    return {
      id: e.id, // the object id. used for generic handling of entities in the store
      personId: e.personId, // differentiator for person || company
      companyId: e.companyId, // see above
      associatedCompanyId: e.associatedCompanyId, // TODO what's this again? 🙈
      isUBO: !!e.uboAdded, // shows UBO pill in the UI
      position: e.position,
      name: e.name, // TODO what displays on the card in the UI. Do we want this to be addressee for people?
      isMain: e.companyId ? e.id === e.companyId : e.isMain, // drives which pill to show in the UI
      address: e.address, // address that shows in UI
      personDateAmlCompleted: e.personDateAmlCompleted && passedDate ? e.personDateAmlCompleted : e.amlPassed, // shows the individual compliance pass date in the UI under the entity card
      amlPassed: e.amlPassed, // TODO is this a boolean or date?
      compliancePassedBy: e.compliancePassedByFullName, // the name of user that passed the checks which shows in the UI
      documents: mapDocumentsForView(e.documents || []) // the various documents that an entity has
    }
  })
}

/***
 * @function identifyAmlOrKyc
 * @param {Object} valuation - a valuation object from the API
 * @description looks at valuation and figures out to display AML or KYC labels in the UI
 */
export const identifyAmlOrKyc = (valuation): string => {
  console.log('identifyAmlOrKyc: ')
  console.log('valuation.valuationType: ', valuation.valuationType)
  console.log('valuation.suggestedAskingRentLongLetMonthly: ', valuation.suggestedAskingRentLongLetMonthly)
  console.log('valuation.suggestedAskingRentShortLetMonthly: ', valuation.suggestedAskingRentShortLetMonthly)
  const amlOrKyc =
    valuation.valuationType == ValuationTypeEnum.Lettings ||
    (valuation.suggestedAskingRentLongLetMonthly &&
      (valuation.suggestedAskingRentLongLetMonthly < 7500 || valuation.suggestedAskingRentShortLetMonthly < 7500))
      ? 'KYC'
      : valuation.valuationType == ValuationTypeEnum.Sales ||
        valuation.suggestedAskingRentLongLetMonthly >= 7500 ||
        valuation.suggestedAskingRentShortLetMonthly >= 7500
      ? 'AML'
      : 'KYC'
  console.log('setting compliance check type to amlOrKyc: = ', amlOrKyc)
  return amlOrKyc
}
