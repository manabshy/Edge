import { ValuationTypeEnum } from '../../shared/valuation'
import { mapDocumentsForView } from './store-documents-helpers'

/***
 * @function buildStoreState
 * @param {ContactGroup} storeState.contactGroupData - the current contact group loaded into _valuationFacadeSvc
 * @param {Valuation} storeState.valuationData - the current valuation loaded into _valuationFacadeSvc
 * @param {Person|Company} storeState.entityToAdd? - optional parameter of newly created company | contact that needs to be loaded into the store when it builds
 * @description Builds initial store state when the store is loaded
 * @returns Object containing properties for the compliance checks store
 */
export const buildStoreState = (storeState) => {
  const entitiesData = mergeEntitiesReadyForStore(storeState.valuationData, storeState.entityToAdd)
  return {
    valuationEventId: storeState.valuationData.valuationEventId,
    contactGroupId: storeState.contactGroupData.contactGroupId,
    companyId: storeState.contactGroupData ? storeState.contactGroupData.companyId : null,
    companyOrContact: storeState.contactGroupData?.companyId ? 'company' : 'contact',
    checkType: identifyAmlOrKyc(storeState.valuationData),
    isFrozen: storeState.valuationData.isFrozen,
    compliancePassedDate: storeState.valuationData.complianceCheck?.compliancePassedDate,
    compliancePassedBy: storeState.valuationData.complianceCheck?.compliancePassedByFullName,
    entities: buildEntitiesArray(entitiesData, storeState.valuationData.complianceCheck.compliancePassedDate)
  }
}

export const patchEntities = (entitiesData) => {
  return {
    entities: buildEntitiesArray(entitiesData)
  }
}

/***
 * @function buildEntitiesArray
 * @param {Object[]} entitites - array of company | person objects for the store
 * @param {string} passedDate - date the valuation was passed. Temporarirly using this since individual compliance passed dates are not being set to null when docs are refreshed. Fixes Bug 2973
 * @description Builds entities array for store mapping from API shape to Store shape. Any API props for entities that need changing look here first
 */
export const buildEntitiesArray = (entitites, passedDate?) => {
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
      isAdmin: e.isAdmin,
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
  if (valuation.valuationType === ValuationTypeEnum.Sales) {
    return 'AML'
  } else if (valuation.valuationType === ValuationTypeEnum.Lettings) {
    return valuation.suggestedAskingRentLongLetMonthly >= 7500 || valuation.suggestedAskingRentShortLetMonthly >= 7500
      ? 'AML'
      : 'KYC'
  }
}

const mergeEntitiesReadyForStore = (valuationData, entityToAdd) => {
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
  return entitiesData
}
