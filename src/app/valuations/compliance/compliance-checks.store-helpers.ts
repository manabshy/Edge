import { DOCUMENT_TYPE } from './components/document-info/document-info.component'
import { ComplianceDocTypes } from './compliance-checks.store'
import moment from 'moment'

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

export const addTmpFilesToFiles = (ev, files, person) => {
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

export const mergeTmpFilesWithFiles = (ev, files, person) => {
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

/***
 * maps array of documents to docsObject model used by the view
 */
export const mapDocumentsForView = (documents): ComplianceDocTypes => {
  let docsObject = {
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

export const setContactsForCompliance = (personGroup) => {
  return personGroup.map((person) => {
    return {
      personId: person.personId,
      name: person.name,
      isMain: person.isMain,
      address: person.address,
      personDateAmlcompleted: person.personDateAmlcompleted,
      documents: mapDocumentsForView(person.documents),
    }
  })
}

export const checkAllPeopleHaveValidDocs = (people, checkType) => {
  let checksAreValid
  if (checkType === 'AML') {
    checksAreValid = people.some((person) => personValidForAML(person.documents))
  } else if (checkType === 'KYC') {
    checksAreValid = people.some((person) => personValidForKYC(person.documents))
  }
  return checksAreValid
}

const personValidForAML = (docs) => {
  return idIsValid(docs.idDoc.files) && docs.reportDocs.files.length && docs.proofOfAddressDoc.files.length
}

const personValidForKYC = (docs) => {
  return idIsValid(docs.idDoc.files) && docs.proofOfAddressDoc.files.length
}

const idIsValid = (files: any[]) => {
  const hasIdDoc = !!files.length
  if (!hasIdDoc) return false
  const hasValidExpiryDate = moment(files[0].idValidationDateExpiry) > moment()
  return hasIdDoc && hasValidExpiryDate
}

export const identifyAmlOrKyc = (valuation): string => {
  return valuation.suggestedAskingRentLongLetMonthly < 7500 ||
  valuation.suggestedAskingRentShortLetMonthly < 7500
    ? 'KYC'
    : 'AML'
}

export const buildComplianceChecksStatusMessages = (people, amlOrKyc) => {
  let messageObj = {
    type: '',
    text: [],
    valid: false,
  }
  const validContacts = []
  const invalidContacts = []
  const contactsReadyForChecks = []
  people.forEach((person) => {
    if (person.personDateAmlcompleted && personValidForAML(person.documents)) {
      validContacts.push(person)
    } else if (!person.personDateAmlcompleted && personValidForAML(person.documents)) {
      contactsReadyForChecks.push(person)
    } else {
      invalidContacts.push(person)
    }
  })

  if (validContacts.length === people.length) {
    // const difference = moment(new Date('01/01/2020')).diff(Date.now(), 'months')
    const difference = moment(validContacts[0].personDateAmlcompleted).diff(Date.now(), 'months')
    if (difference <= -12) {
      console.log('last updated more than a year ago')
      messageObj.type = 'warn'
      messageObj.text = [
        amlOrKyc + ' checks are more than a year old. Consider updating.',
        'Last checks passed: ' + moment(validContacts[0].personDateAmlcompleted).format('Do MMM YYYY (HH:mm)'),
      ]
      messageObj.valid = true
    } else {
      messageObj.type = 'success'
      messageObj.text = [
        amlOrKyc + ' checks valid',
        '' + moment(validContacts[0].personDateAmlcompleted).format('Do MMM YYYY (HH:mm)'),
      ]
      messageObj.valid = true
    }
  } else if (contactsReadyForChecks.length === people.length) {
    messageObj.type = 'info'
    messageObj.text = [
      amlOrKyc + ' checks not passed.',
      'Contacts in group have necessary documents and compliance checks are ready to run.',
    ]
    messageObj.valid = false
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
