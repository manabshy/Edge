import { ValuationTypeEnum } from '../shared/valuation'
import { mapDocsForAPI, mapDocumentsForView } from './helpers/store-documents-helpers'

/***
 * @function addFilesToPerson
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
  console.log('RAW PEOPLE FROM API: ', entitites)
  return entitites.map((e) => {
    return {
      id: e.id,
      personId: e.personId,
      companyId: e.companyId,
      associatedCompanyId: e.associatedCompanyId,
      name: e.name,
      isMain: e.companyId ? e.id === e.companyId : e.isMain,
      address: e.address,
      personDateAmlCompleted: e.personDateAmlCompleted && passedDate ? e.personDateAmlCompleted : e.amlPassed,
      amlPassed: e.amlPassed,
      compliancePassedBy: e.compliancePassedByFullName,
      isUBO: discernIsUBO(e),
      documents: mapDocumentsForView(e.documents || [])
    }
  })
}

/***
 * @function discernIsUBO
 * @param {Object} entity - person/company entity
 * @description logic for figuring out if entity is currently UBO or not
 */
const discernIsUBO = (entity) => {
  return !!entity.uboAdded // TODO
}

/***
 * @function identifyAmlOrKyc
 * @param {Object} valuation - a valuation object from the API
 * @description looks at valuation and figures out to display AML or KYC labels
 */
export const identifyAmlOrKyc = (valuation): string => {
  // TODO check and add criteria for sale?
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
  // console.log('amlOrKyc: = ', amlOrKyc)
  return amlOrKyc
}

/***
 * @function addExistingEntity
 * @param {Object} entity - person/company
 * @description loads a single entity (person or company) into the store with data from the API
 */
export const addExistingEntity = (storeState, entity) => {
  return {
    ...entity,
    isMain: storeState.companyId === entity.id,
    documents: mapDocumentsForView(entity.documents)
  }
}

/***
 * @function workOutDataShapeForApi
 * @param {Object[]} entities - people/companies to be saved to API
 * @param {string} companyOrContact - flag to determine which shape object to build
 * @param {number} companyId - companyId to save to
 * @param {number} contactGroupId
 * @description maps the store data into correct shape for saving to API. Payload differs between personal and company compliance checks
 */
export const workOutDataShapeForApi = (entities, companyOrContact, companyId, contactGroupId) => {
  console.log('workOutDataShapeForApi: ', entities)
  if (companyOrContact === 'contact') {
    // console.log('build contacts array')
    const entitiesToSave = entities.map((entity) => {
      return {
        personId: entity.personId,
        name: entity.name,
        address: entity.address ? entity.address : 'Unset',
        documents: mapDocsForAPI(entity.documents),
        isMain: entity.isMain,
        position: entity.position ? entity.position : 'Unset',
        personDateAmlCompleted: entity.personDateAmlCompleted ? entity.personDateAmlCompleted : null
      }
    })
    return {
      entitiesToSave,
      contactGroupId
    }
  } else if (companyOrContact === 'company') {
    // console.log('build company and contacts arrays sepearately');
    const personDocuments = []
    const companyDocuments = []
    entities.forEach((entity) => {
      const updatedPerson: any = {
        uboAdded: entity.uboAdded,
        documents: mapDocsForAPI(entity.documents)
      }
      if (entity.companyId) {
        updatedPerson.associatedCompanyId = entity.associatedCompanyId
        companyDocuments.push(updatedPerson)
      } else {
        updatedPerson.position = entity.position ? entity.position : 'Not set'
        updatedPerson.address = entity.address ? entity.address : 'Not set'
        updatedPerson.personId = entity.personId
        updatedPerson.name = entity.name
        personDocuments.push(updatedPerson)
      }
    })
    const savePayload = {
      companyId,
      companyDocuments,
      personDocuments
    }
    return {
      savePayload,
      contactGroupId
    }
  }
}
