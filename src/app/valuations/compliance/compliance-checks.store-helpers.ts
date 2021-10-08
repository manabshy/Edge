import { DOCUMENT_TYPE } from './components/document-info/document-info.component'
import { ComplianceDocTypes } from './compliance-checks.interfaces'
import moment from 'moment'
import { ValuationTypeEnum } from '../shared/valuation'
/***
 *
 * Builds initial store state when a compliance state is initializing
 */
export const buildPartialLoadState = (contactGroupData, valuationData) => {
  return {
    contactGroupId: valuationData.propertyOwner.contactGroupId,
    companyOrContact: contactGroupData.companyId ? 'company' : 'contact',
    checkType: identifyAmlOrKyc(valuationData),
    compliancePassedBy: valuationData.complianceCheck?.compliancePassedByFullName,
    compliancePassedDate: valuationData.complianceCheck?.compliancePassedDate,
    valuationEventId: valuationData.valuationEventId,
    companyId: contactGroupData.companyId,
  }
}
/***
 * Builds people array for store mapping from API shape to Store shape. Any API props for people that need changing look here first
 */
export const setContactsForCompliance = (people) => {
  return people.map((p) => {
    return {
      originalId: p.id,
      personId: p.personId,
      companyId: p.companyId,
      // isContactOrCompany: p.personId ? 'contact' : 'company',
      associatedComnpanyId: p.associatedComnpanyId,
      name: p.name,
      isMain: p.isMain,
      address: p.address,
      personDateAmlcompleted: p.personDateAmlcompleted ? p.personDateAmlcompleted : p.amlPassed,
      amlPassed: p.amlPassed,
      compliancePassedBy: p.compliancePassedByFullName,
      isUBO: discernIsUBO(p),
      documents: mapDocumentsForView(p.documents),
    }
  })
}

const discernIsUBO = (person) => {
  return !!person.uboAdded // TODO
}

/***
 * logic for figuring out to display AML or KYC labels
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
 * AML | KYC validation for checking if all people in store are fit for passing checks
 */
export const checkAllPeopleHaveValidDocs = (people, checkType) => {
  let checksAreValid
  if (checkType === 'AML') {
    checksAreValid = people.every((person) => personValidForAML(person.documents))
  } else if (checkType === 'KYC') {
    checksAreValid = people.every((person) => personValidForKYC(person.documents))
  }
  return checksAreValid
}

export const personValidForAML = (docs) => {
  return personValidForKYC(docs) && docs.reportDocs.files.length
}

export const personValidForKYC = (docs) => {
  return idIsValid(docs.idDoc.files) && docs.proofOfAddressDoc.files.length
}

const idIsValid = (files: any[]) => {
  const hasIdDoc = !!files.length
  if (!hasIdDoc) return false
  const hasValidExpiryDate = moment(files[0].idValidationDateExpiry) > moment()
  return hasIdDoc && hasValidExpiryDate
}

/***
 * Adding/Removing/Merging documents from people
 */
export const removeDocFromDocumentsObject = (data) => {
  return {
    ...data.person,
    documents: findAndRemoveDoc(data.person.documents, data.ev),
  }
}

export const addFiles = (data, person) => {
  return {
    ...person,
    documents: addTmpFilesToFiles(data.ev, data.files, person),
  }
}

export const mergeFiles = (data, person) => {
  return {
    ...person,
    documents: mergeTmpFilesWithFiles(data.ev, data.tmpFiles, person),
  }
}

export const findAndRemoveDoc = (documents, ev) => {
  switch (ev.documentType) {
    case DOCUMENT_TYPE.ID:
      documents.idDoc.files = []
      break

    case DOCUMENT_TYPE.PROOF_OF_ADDRESS:
      documents.proofOfAddressDoc.files = []
      break

    case DOCUMENT_TYPE.REPORT:
      documents.reportDocs.files = documents.reportDocs.files.filter((doc) => doc.fileStoreId !== ev.id)
      break

    case DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS:
      documents.additionalDocs.files = documents.additionalDocs.files.filter((doc) => doc.fileStoreId !== ev.id)
      break
  }
  return documents
}

export const addTmpFilesToFiles = (ev, files, person): ComplianceDocTypes => {
  files.forEach((file) => {
    switch (ev.documentType) {
      case DOCUMENT_TYPE.PROOF_OF_ADDRESS:
        person.documents.proofOfAddressDoc.files[0] = {
          ...file,
          fileName: file.fileName,
          blobName: file.blobName,
          blobFileTypeId: 48,
        }
        break

      case DOCUMENT_TYPE.ID:
        person.documents.idDoc.files[0] = {
          ...file,
          idValidationDateExpiry: ev.idValidationDateExpiry,
          fileName: file.fileName,
          blobName: file.blobName,
          blobFileTypeId: 49,
        }
        break

      case DOCUMENT_TYPE.REPORT:
        person.documents.reportDocs.files.push({
          ...file,
          fileName: file.fileName,
          blobName: file.blobName,
          blobFileTypeId: 51,
        })
        break

      case DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS:
        person.documents.additionalDocs.files.push({
          ...file,
          fileName: file.fileName,
          blobName: file.blobName,
          blobFileTypeId: 50,
          label: file.fileName,
        })
        break
    }
  })
  return person.documents
}

export const mergeTmpFilesWithFiles = (ev, files, person): ComplianceDocTypes => {
  const filesToMerge = files.filter((file) => file.blobFileTypeId === ev.documentType)

  switch (ev.documentType) {
    case DOCUMENT_TYPE.PROOF_OF_ADDRESS:
      person.documents.proofOfAddressDoc.files = []
      filesToMerge.forEach((file) => {
        person.documents.proofOfAddressDoc.files.push({
          ...file,
          fileName: file.fileName,
          blobName: file.blobName,
          blobFileTypeId: 48,
        })
      })
      break

    case DOCUMENT_TYPE.ID:
      person.documents.idDoc.files = []
      filesToMerge.forEach((file) => {
        person.documents.idDoc.files.push({
          ...file,
          idValidationDateExpiry: ev.idValidationDateExpiry,
          fileName: file.fileName,
          blobName: file.blobName,
          blobFileTypeId: 49,
        })
      })
      break

    case DOCUMENT_TYPE.REPORT:
      person.documents.reportDocs.files = []
      filesToMerge.forEach((file) => {
        person.documents.reportDocs.files.push({
          ...file,
          fileName: file.fileName,
          blobName: file.blobName,
          blobFileTypeId: 51,
        })
      })
      break

    case DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS:
      person.documents.additionalDocs.files = []
      filesToMerge.forEach((file) => {
        person.documents.additionalDocs.files.push({
          ...file,
          fileName: file.fileName,
          blobName: file.blobName,
          blobFileTypeId: 50,
          label: file.fileName,
        })
      })
      break
  }
  return person.documents
}

export const addDocsShell = () => {
  return {
    idDoc: {
      label: 'ID',
      documentType: DOCUMENT_TYPE.ID,
      files: [],
    },
    proofOfAddressDoc: {
      label: 'Proof of Address',
      documentType: DOCUMENT_TYPE.PROOF_OF_ADDRESS,
      files: [],
    },
    reportDocs: {
      label: 'Report',
      documentType: DOCUMENT_TYPE.REPORT,
      files: [],
    },
    additionalDocs: {
      label: 'Additional Documents',
      documentType: DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS,
      files: [],
    },
  }
}
/***
 * maps array of documents to docsObject model used by the view
 */
export const mapDocumentsForView = (documents): ComplianceDocTypes => {
  let docsObject = addDocsShell()

  documents.forEach((doc) => {
    switch (doc.blobFileTypeId) {
      case DOCUMENT_TYPE.ID:
        docsObject.idDoc.files.push({ ...doc, label: 'ID' })
        break
      case DOCUMENT_TYPE.PROOF_OF_ADDRESS:
        docsObject.proofOfAddressDoc.files.push({ ...doc, label: 'Proof of Address' })
        break
      case DOCUMENT_TYPE.REPORT:
        docsObject.reportDocs.files.push({ ...doc, label: 'Report' })
        break
      case DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS:
        docsObject.additionalDocs.files.push({ ...doc, label: doc.fileName })
        break
    }
  })
  return docsObject
}

/***
 * maps docsObject model back into documents array for sending to the API
 */
export const mapDocsForAPI = (docs) => {
  let docsArray = []
  // add ID doc
  if (docs.idDoc.files.length) {
    docsArray.push(docs.idDoc.files[0])
  }
  // add Proof of Address doc
  if (docs.proofOfAddressDoc.files.length) {
    docsArray.push(docs.proofOfAddressDoc.files[0])
  }
  // add Report docs
  if (docs.reportDocs.files.length) {
    docs.reportDocs.files.forEach((doc) => {
      docsArray.push(doc)
    })
  }
  // add Additional Docs
  if (docs.additionalDocs.files.length) {
    docs.additionalDocs.files.forEach((doc) => {
      docsArray.push(doc)
    })
  }
  return docsArray
}

export const buildComplianceChecksStatusMessages = (
  people,
  amlOrKyc,
  compliancePassedDate,
  compliancePassedByFullName,
) => {
  // console.log('amlOrKyc: ', amlOrKyc)
  let messageObj = {
    type: '',
    text: [],
    valid: false,
  }
  const validContacts = []
  const invalidContacts = []
  const contactsReadyForChecks = []
  // console.log(amlOrKyc)
  people.forEach((person) => {
    const validDocs = amlOrKyc === 'AML' ? personValidForAML(person.documents) : personValidForKYC(person.documents)
    if (person.personDateAmlcompleted && validDocs) {
      validContacts.push(person)
    } else if (!person.personDateAmlcompleted && validDocs) {
      contactsReadyForChecks.push(person)
    } else {
      invalidContacts.push(person)
    }
  })

  if (validContacts.length === people.length && !!compliancePassedDate) {
    const difference = moment(compliancePassedDate).diff(Date.now(), 'months')
    if (difference <= -12) {
      messageObj.type = 'warn'
      messageObj.text = [
        amlOrKyc + ' checks are more than a year old. Consider updating.',
        'Last checks passed: ' +
          moment(compliancePassedDate).format('Do MMM YYYY (HH:mm)') +
          ' by ' +
          compliancePassedByFullName,
      ]
      messageObj.valid = true
    } else {
      messageObj.type = 'success'
      messageObj.text = [
        amlOrKyc + ' checks valid',
        '' + moment(compliancePassedDate).format('Do MMM YYYY (HH:mm)') + ' by ' + compliancePassedByFullName,
      ]
      messageObj.valid = true
    }
  } else if (
    contactsReadyForChecks.length === people.length ||
    contactsReadyForChecks.length + validContacts.length === people.length
  ) {
    messageObj.type = 'info'
    messageObj.text = [
      amlOrKyc + ' checks not passed.',
      'Contacts in group have necessary documents and compliance checks are ready to run.',
    ]
    messageObj.valid = true
  } else {
    let warningMessage = ''
    if (invalidContacts.length > 1) {
      /***
       * invalidContacts = [{name: 'Dave'}, {name: 'Leanne'}, {name: 'John'}]
       */
      invalidContacts.forEach((person, ix) => {
        if (ix == 0) {
          warningMessage += person.name
        } else if (ix == invalidContacts.length - 1) {
          warningMessage += ' and ' + person.name
        } else {
          warningMessage += ', ' + person.name
        }
      })
    } else {
      warningMessage = invalidContacts[0].name
    }
    invalidContacts.length == 1 ? (warningMessage += ' requires attention.') : (warningMessage += ' require attention.')
    messageObj.type = 'warn'
    messageObj.text = [amlOrKyc + ' checks invalid. ', warningMessage]
    messageObj.valid = false
  }
  return messageObj
}

export const workOutDataShapeForApi = (people, companyOrContact, companyId, contactGroupId) => {
  if (companyOrContact === 'contact') {
    // console.log('build contacts array')
    const peopleToSave = people.map((person) => {
      return {
        personId: person.personId,
        name: person.name,
        address: person.address,
        documents: mapDocsForAPI(person.documents),
        isMain: person.isMain,
        position: person.position,
        personDateAmlcompleted: person.personDateAmlcompleted,
      }
    })
    return {
      peopleToSave,
      contactGroupId,
    }
  } else if (companyOrContact === 'company') {
    // console.log('build company and contacts arrays sepearately')
    const personDocuments = []
    const companyDocuments = []
    people.forEach((person) => {
      const updatedPerson: any = {
        id: person.originalId,
        name: person.name,
        address: person.address,
        documents: mapDocsForAPI(person.documents),
        isMain: person.isMain,
        position: person.position,
        uboAdded: person.uboAdded ? person.uboAdded : null,
      }
      if (person.companyId) {
        ;(updatedPerson.companyId = person.companyId),
          (updatedPerson.amlPassed = person.amlPassed),
          companyDocuments.push(updatedPerson)
      } else {
        ;(updatedPerson.personId = person.personId),
          (updatedPerson.personDateAmlcompleted = person.personDateAmlcompleted),
          personDocuments.push(updatedPerson)
      }
    })
    const savePayload = {
      companyId,
      companyDocuments,
      personDocuments,
    }
    return {
      savePayload,
      contactGroupId,
    }
  }
}
