import moment from 'moment'

export const buildComplianceChecksStatusMessages = (
  entities,
  amlOrKyc,
  compliancePassedDate,
  compliancePassedByFullName
) => {
  // console.log('amlOrKyc: ', amlOrKyc)
  let messageObj = {
    type: '',
    text: [],
    valid: false
  }
  const validContacts = []
  const invalidContacts = []
  const contactsReadyForChecks = []
  // console.log('buildComplianceChecksStatusMessages:', entities)
  entities.forEach((entity) => {
    const validDocs = amlOrKyc === 'AML' ? entityValidForAML(entity) : entityValidForKYC(entity)
    // console.log('validDocs: ', validDocs)
    if (entity.personDateAmlCompleted && validDocs) {
      validContacts.push(entity)
    } else if (!entity.personDateAmlCompleted && validDocs) {
      contactsReadyForChecks.push(entity)
    } else {
      invalidContacts.push(entity)
    }
  })

  if (validContacts.length === entities.length && !!compliancePassedDate) {
    const difference = moment(compliancePassedDate).diff(Date.now(), 'months')
    if (difference <= -12) {
      messageObj.type = 'warn'
      messageObj.text = [
        amlOrKyc + ' checks are more than a year old. Consider updating.',
        'Last checks passed: ' +
          moment(compliancePassedDate).format('Do MMM YYYY (HH:mm)') +
          ' by ' +
          compliancePassedByFullName
      ]
      messageObj.valid = true
    } else {
      messageObj.type = 'success'
      messageObj.text = [
        amlOrKyc + ' checks valid',
        '' + moment(compliancePassedDate).format('Do MMM YYYY (HH:mm)') + ' by ' + compliancePassedByFullName
      ]
      messageObj.valid = true
    }
  } else if (
    contactsReadyForChecks.length === entities.length ||
    contactsReadyForChecks.length + validContacts.length === entities.length
  ) {
    messageObj.type = 'info'
    messageObj.text = [
      amlOrKyc + ' checks not passed.',
      'Contacts in group have necessary documents and compliance checks are ready to run.'
    ]
    messageObj.valid = true
  } else {
    let warningMessage = ''
    if (invalidContacts.length > 1) {
      invalidContacts.forEach((entity, ix) => {
        if (ix == 0) {
          warningMessage += entity.name
        } else if (ix == invalidContacts.length - 1) {
          warningMessage += ' and ' + entity.name
        } else {
          warningMessage += ', ' + entity.name
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
  // console.log('returning validation message obj: ', messageObj)
  return messageObj
}

/***
 * AML | KYC validation for checking if all entities in store are fit for passing checks
 */
export const checkAllEntitiesHaveValidDocs = (entities, checkType) => {
  const checksAreValid = entities.every((entity) => {
    if (checkType === 'AML') {
      return entityValidForAML(entity)
    } else if (checkType === 'KYC') {
      return entityValidForKYC(entity)
    }
  })
  // console.log('checksAreValid: ', checksAreValid)
  // console.log('entities:', entities)
  return checksAreValid
}

const companyValidForChecks = (company) => {
  if (company.companyId === company.associatedCompanyId) {
    // this is the primary company and they must have 3 docs uploaded to additionalDocs
    return company.documents.additionalDocs.files.length >= 3
  } else {
    // this is just an associated company and they only require 1 additionalDoc to be loaded
    return company.documents.additionalDocs.files.length >= 1
  }
}
const entityValidForAML = (entity) => {
  if (entity.companyId) {
    return companyValidForChecks(entity)
  } else {
    return entityValidForKYC(entity) && entity.documents.reportDocs.files.length
  }
}

const entityValidForKYC = (entity) => {
  if (entity.companyId) {
    return companyValidForChecks(entity)
  } else {
    return (
      idIsValid(entity.documents.idDoc.files) &&
      entity.documents.proofOfAddressDoc.files.length &&
      entity.documents.reportDocs.files.length // added back in as per Bug 2990 https://dev.azure.com/Douglas-and-Gordon/Edge/_workitems/edit/2990/
    )
  }
}

const idIsValid = (files: any[]) => {
  const hasIdDoc = !!files.length
  if (!hasIdDoc) return false
  const hasValidExpiryDate = moment(files[0].idValidationDateExpiry) > moment()
  return hasIdDoc && hasValidExpiryDate
}
