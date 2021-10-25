import { ValuationTypeEnum } from '../shared/valuation'
import { mapDocsForAPI, mapDocumentsForView } from './helpers/store-documents-helpers'

/***
 * @function addFilesToPerson
 * @param contactGroupData: Object
 * @param valuationData: Object
 * @description Builds initial store state when a compliance state is initializing
 */
export const buildPartialLoadState = (contactGroupData, valuationData) => {
  // console.log('valuationData.complianceCheck: ', valuationData.complianceCheck)
  return {
    contactGroupId: valuationData.propertyOwner?.contactGroupId,
    companyOrContact: contactGroupData.companyId ? 'company' : 'contact',
    checkType: identifyAmlOrKyc(valuationData),
    compliancePassedBy: valuationData.complianceCheck?.compliancePassedByFullName,
    compliancePassedDate: valuationData.complianceCheck?.compliancePassedDate,
    valuationEventId: valuationData.valuationEventId,
    companyId: contactGroupData.companyId,
    isFrozen: valuationData.complianceCheck?.compliancePassedDate ? true : false
  }
}

/***
 * @function setContactsForCompliance
 * @param people: Array
 * @description Builds people array for store mapping from API shape to Store shape. Any API props for people that need changing look here first
 */
export const setContactsForCompliance = (people) => {
  console.log('RAW PEOPLE FROM API: ', people)
  return people.map((p) => {
    return {
      id: p.id,
      personId: p.personId,
      companyId: p.companyId,
      // isContactOrCompany: p.personId ? 'contact' : 'company',
      associatedCompanyId: p.associatedCompanyId,
      name: p.name,
      isMain: p.isMain,
      address: p.address,
      personDateAmlCompleted: p.personDateAmlCompleted ? p.personDateAmlCompleted : p.amlPassed,
      amlPassed: p.amlPassed,
      compliancePassedBy: p.compliancePassedByFullName,
      isUBO: discernIsUBO(p),
      documents: mapDocumentsForView(p.documents)
    }
  })
}

/***
 * @function discernIsUBO
 * @param person: Object
 * @description logic for figuring out if user is currently UBO or not
 */
const discernIsUBO = (person) => {
  return !!person.uboAdded // TODO
}

/***
 * @function identifyAmlOrKyc
 * @param valuation
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
 * @param person
 * @description loads a single person or company into the store with data from the API
 */
export const addExistingPersonOrCompany = (person) => {
  return {
    ...person,
    documents: mapDocumentsForView(person.documents)
  }
}

/***
 * @function workOutDataShapeForApi
 * @param people Array
 * @param companyOrContact String
 * @param companyId Number
 * @param contactGroupId Number
 * @description maps the store data into correct shape for saving to API. Payload differs between personal and company compliance checks
 */
export const workOutDataShapeForApi = (people, companyOrContact, companyId, contactGroupId) => {
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
