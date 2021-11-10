import { ValuationTypeEnum } from '../shared/valuation'
import { mapDocumentsForView } from './helpers/store-documents-helpers'

/***
 * @function buildStoreState
 * @param {Valuation} valuationData - the current valuation loaded into _valuationFacadeSvc
 * @param {Person|Company} entityToAdd? - optional parameter of newly created company | contact that needs to be loaded into the store when it builds
 * @description Builds initial store state when the store is loaded
 * @returns Object containing properties for the compliance checks store
 */
export const buildStoreState = (valuationData, entityToAdd, adminContact) => {
  const entitiesData = mergeEntitiesReadyForStore(valuationData, entityToAdd, adminContact)
  return {
    valuationEventId: valuationData.valuationEventId,
    contactGroupId: valuationData.propertyOwner?.contactGroupId,
    companyId: valuationData.propertyOwner.companyId,
    companyOrContact: valuationData.propertyOwner.companyId ? 'company' : 'contact',
    checkType: identifyAmlOrKyc(valuationData),
    isFrozen: valuationData.complianceCheck?.compliancePassedDate ? true : false,
    compliancePassedDate: valuationData.complianceCheck?.compliancePassedDate,
    compliancePassedBy: valuationData.complianceCheck?.compliancePassedByFullName,
    entities: buildEntitiesArray(entitiesData, valuationData.complianceCheck.compliancePassedDate)
  }
}

/***
 * @function buildEntitiesArray
 * @param {Object[]} entitites - array of company | person objects for the store
 * @param {string} passedDate - date the valuation was passed. Temporarirly using this since individual compliance passed dates are not being set to null when docs are refreshed. Fixes Bug 2973
 * @description Builds entities array for store mapping from API shape to Store shape. Any API props for entities that need changing look here first
 */
export const buildEntitiesArray = (entitites, passedDate) => {
  return entitites.map((e) => {
    return {
      id: e.id, // the object id. used for generic handling of entities in the store
      personId: e.personId, // differentiator for person || company
      companyId: e.companyId, // see above
      associatedCompanyId: e.associatedCompanyId,
      isUBO: !!e.uboAdded,
      position: e.position,
      name: e.name,
      isMain: e.isNew ? false : e.companyId ? e.id === e.companyId : e.isMain,
      address: e.address, // address that shows in UI
      personDateAmlCompleted: e.personDateAmlCompleted && passedDate ? e.personDateAmlCompleted : e.amlPassed, // shows the individual compliance pass date in the UI under the entity card
      amlPassed: e.amlPassed,
      compliancePassedBy: e.compliancePassedByFullName, // the name of user that passed the checks which shows in the UI
      documents: mapDocumentsForView(e.documents || []) // the various documents that an entity has
    }
  })
}

/***
 * @function identifyAmlOrKyc
 * @param {Object} valuation - a raw valuation object from the API
 * @description looks at valuation and figures out to display AML or KYC labels in the UI
 */
export const identifyAmlOrKyc = (valuation): string => {
  // console.log('identifyAmlOrKyc: ')
  // console.log('valuation.valuationType: ', valuation.valuationType)
  // console.log('valuation.suggestedAskingRentLongLetMonthly: ', valuation.suggestedAskingRentLongLetMonthly)
  // console.log('valuation.suggestedAskingRentShortLetMonthly: ', valuation.suggestedAskingRentShortLetMonthly)
  try {
    const amlOrKyc =
      valuation.suggestedAskingRentLongLetMonthly < 7500 || valuation.suggestedAskingRentShortLetMonthly < 7500
        ? 'KYC'
        : valuation.suggestedAskingRentLongLetMonthly >= 7500 || valuation.suggestedAskingRentShortLetMonthly >= 7500
        ? 'AML'
        : 'KYC'
    console.log('setting compliance check type to amlOrKyc: = ', amlOrKyc)
    return amlOrKyc
  } catch (e) {
    console.error('error figuring out AML || KYC ', e)
  }
}

const mergeEntitiesReadyForStore = (valuationData, entityToAdd, adminContact) => {
  let entitiesData
  if (valuationData.companyDocuments) {
    entitiesData = valuationData.companyDocuments.concat(valuationData.personDocuments)
  } else {
    entitiesData = valuationData.personDocuments
  }
  if (entityToAdd) {
    const entityAlreadyExists = entitiesData.find((e) => e.id === entityToAdd.id)
    if (!entityAlreadyExists) {
      entitiesData.push(entityToAdd)
    }
  }
  if (adminContact) {
    entitiesData.push(adminContact)
  }
  return entitiesData
}
