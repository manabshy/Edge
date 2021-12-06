import moment from 'moment'

export const buildComplianceChecksStatusMessages = (
  entities,
  amlOrKyc,
  compliancePassedDate,
  compliancePassedByFullName
) => {

  // console.log('buildComplianceChecksStatusMessages: ' + compliancePassedDate + ' ' + compliancePassedByFullName)
  let messageObj = {
    type: '',
    text: [],
    valid: false
  }
  const validContacts = []
  const invalidContacts = []
  const contactsReadyForChecks = []

  entities.forEach((entity) => {
    const validDocs = amlOrKyc === 'AML' ? entityValidForAML(entity) : entityValidForKYC(entity)
    if (entity.personDateAmlCompleted && validDocs) {
      // contact has valid documents and compliance checks timestamp against them
      validContacts.push(entity)
    } else if (!entity.personDateAmlCompleted && validDocs) {
      // entity has valid docs but no compliance checks timestamp yet. They're ready for checking
      contactsReadyForChecks.push(entity)
    } else {
      // entity has invalid docs
      invalidContacts.push(entity)
    }
  })

  if (validContacts.length === entities.length && !!compliancePassedDate) {
    // VALID MESSAGES
    const difference = moment(compliancePassedDate).diff(Date.now(), 'months')
    if (difference <= -12) {
      setOlderThanYearOldMessage(messageObj, amlOrKyc, compliancePassedDate, compliancePassedByFullName)
    } else {
      setValidMessage(messageObj, amlOrKyc, compliancePassedDate, compliancePassedByFullName)
    }
  } else if (
    contactsReadyForChecks.length === entities.length ||
    contactsReadyForChecks.length + validContacts.length === entities.length
  ) {
    // VALID: READY TO RUN MESSAGE
    setReadyToPassChecksMessage(messageObj, amlOrKyc)
  } else {
    // INVALID MESSAGING
    setInvalidChecksMessage(invalidContacts, messageObj, amlOrKyc)
  }
  // console.log('returning validation message obj: ', messageObj)
  return messageObj
}

/***
 * AML | KYC validation for checking if all entities in store are fit for passing checks
 */
export const checkAllEntitiesHaveValidDocs = (entities, checkType): boolean => {
  const checksAreValid: boolean = entities.every((entity) => {
    if (checkType === 'AML') {
      return entityValidForAML(entity)
    } else if (checkType === 'KYC') {
      return entityValidForKYC(entity)
    }
  })
  return checksAreValid
}

const entityValidForAML = (entity): boolean => {
  if (entity.companyId) {
    return companyValidForChecks(entity)
  } else {
    return entityValidForKYC(entity) && entity.documents.reportDocs.files.length
  }
}

const entityValidForKYC = (entity): boolean => {
  if (entity.companyId) {
    return companyValidForChecks(entity)
  } else {
    return (
      idIsValid(entity.documents.idDoc.files) &&
      entity.documents.proofOfAddressDoc.files.length
    )
  }
}

const companyValidForChecks = (company): boolean => {
  if (company.companyId === company.associatedCompanyId) {
    // BIZ RULE: this is the primary company and they must have 3 docs uploaded to additionalDocs
    return company.documents.additionalDocs.files.length >= 3
  } else {
    // BIZ RULE: this is just an associated company and they only require 1 additionalDoc to be loaded
    return company.documents.additionalDocs.files.length >= 1
  }
}

/***
 * @description checks there is an ID document and that it's expiry date isn't in the past (aka it's expired)
 */
const idIsValid = (files: any[]): boolean => {
  const hasIdDoc = !!files.length
  if (!hasIdDoc) return false
  const hasValidExpiryDate = moment(files[0].idValidationDateExpiry) > moment()
  return hasIdDoc && hasValidExpiryDate
}

/***
 * @description tells the user if the checks are valid but older than 1 year
 */
const setOlderThanYearOldMessage = (messageObj, amlOrKyc, compliancePassedDate, compliancePassedByFullName) => {
  messageObj.type = 'warn'
  messageObj.text = [
    amlOrKyc + ' checks are more than a year old. Consider updating.',
    'Last checks passed: ' +
      moment(compliancePassedDate).format('Do MMM YYYY (HH:mm)') +
      ' by ' +
      compliancePassedByFullName
  ]
  messageObj.valid = true
}

/***
 * @description tells the user checks are valid, when they passed and who passed them
 */
const setValidMessage = (messageObj, amlOrKyc, compliancePassedDate, compliancePassedByFullName) => {
  messageObj.type = 'success'
  messageObj.text = [
    amlOrKyc + ' checks valid',
    '' + moment(compliancePassedDate).format('Do MMM YYYY (HH:mm)') + ' by ' + compliancePassedByFullName
  ]
  messageObj.valid = true
}

/***
 * @description tells the user all entities for the valuation have the required documents to pass Compliance Checks
 */
const setReadyToPassChecksMessage = (messageObj, amlOrKyc) => {
  messageObj.type = 'info'
  messageObj.text = [
    amlOrKyc + ' checks not passed.',
    'Contacts in group have necessary documents and compliance checks are ready to run.'
  ]
  messageObj.valid = true
}

/***
 * @description tells the user which entities require attention in order to upload docs and run checks
 */
const setInvalidChecksMessage= (invalidContacts, messageObj, amlOrKyc)=>{
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
