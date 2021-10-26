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
 * @description Builds people array for store mapping from API shape to Store shape. Any API props for people that need changing look here first
 */
export const setContactsForCompliance = (entitites, passedDate) => {
  console.log('RAW PEOPLE FROM API: ', entitites)
  return entitites.map((p) => {
    return {
      id: p.id,
      personId: p.personId,
      companyId: p.companyId,
      associatedCompanyId: p.associatedCompanyId,
      name: p.name,
      isMain: p.isMain,
      address: p.address,
      personDateAmlCompleted: p.personDateAmlCompleted && passedDate ? p.personDateAmlCompleted : p.amlPassed,
      amlPassed: p.amlPassed,
      compliancePassedBy: p.compliancePassedByFullName,
      isUBO: discernIsUBO(p),
      documents: mapDocumentsForView(p.documents)
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
 * @function addExistingPersonOrCompany
 * @param {Object} entity - person/company
 * @description loads a single entity (person or company) into the store with data from the API
 */
export const addExistingPersonOrCompany = (entity) => {
  return {
    ...entity,
    documents: mapDocumentsForView(entity.documents)
  }
}

/***
 * @function workOutDataShapeForApi
 * @param {Object[]} people - people to be saved to API
 * @param {string} companyOrContact - flag to determine which shape object to build
 * @param {number} companyId - companyId to save to
 * @param {number} contactGroupId
 * @description maps the store data into correct shape for saving to API. Payload differs between personal and company compliance checks
 */
export const workOutDataShapeForApi = (people, companyOrContact, companyId, contactGroupId) => {
  console.log('workOutDataShapeForApi: ', people)
  if (companyOrContact === 'contact') {
    // console.log('build contacts array')
    const peopleToSave = people.map((person) => {
      return {
        personId: person.personId,
        name: person.name,
        address: person.address ? person.address : 'Unset',
        documents: mapDocsForAPI(person.documents),
        isMain: person.isMain,
        position: person.position ? person.position : 'Unset',
        personDateAmlCompleted: person.personDateAmlCompleted ? person.personDateAmlCompleted : null
      }
    })
    return {
      peopleToSave,
      contactGroupId
    }
  } else if (companyOrContact === 'company') {
    // console.log('build company and contacts arrays sepearately');
    const personDocuments = []
    const companyDocuments = []
    people.forEach((person) => {
      const updatedPerson: any = {
        uboAdded: person.uboAdded,
        documents: mapDocsForAPI(person.documents)
      }
      if (person.companyId) {
        updatedPerson.associatedCompanyId = person.associatedCompanyId
        companyDocuments.push(updatedPerson)
      } else {
        updatedPerson.position = person.position ? person.position : 'Not set'
        updatedPerson.address = person.address ? person.address : 'Not set'
        updatedPerson.personId = person.personId
        updatedPerson.name = person.name
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
