import moment from 'moment'

export const buildComplianceChecksStatusMessages = (
  people,
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
  // console.log('buildComplianceChecksStatusMessages:', people)
  people.forEach((person) => {
    const validDocs = amlOrKyc === 'AML' ? personValidForAML(person) : personValidForKYC(person)
    // console.log('validDocs: ', validDocs)
    if (person.personDateAmlCompleted && validDocs) {
      validContacts.push(person)
    } else if (!person.personDateAmlCompleted && validDocs) {
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
    contactsReadyForChecks.length === people.length ||
    contactsReadyForChecks.length + validContacts.length === people.length
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
  // console.log('returning validation message obj: ', messageObj)
  return messageObj
}

/***
 * AML | KYC validation for checking if all people in store are fit for passing checks
 */
export const checkAllPeopleHaveValidDocs = (people, checkType) => {
  const checksAreValid = people.every((person) => {
    if (checkType === 'AML') {
      return personValidForAML(person)
    } else if (checkType === 'KYC') {
      return personValidForKYC(person)
    }
  })
  // console.log('checksAreValid: ', checksAreValid)
  // console.log('people:', people)
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
const personValidForAML = (person) => {
  if (person.companyId) {
    return companyValidForChecks(person)
  } else {
    return personValidForKYC(person) && person.documents.reportDocs.files.length
  }
}

const personValidForKYC = (person) => {
  if (person.companyId) {
    return companyValidForChecks(person)
  } else {
    return idIsValid(person.documents.idDoc.files) && person.documents.proofOfAddressDoc.files.length
  }
}

const idIsValid = (files: any[]) => {
  const hasIdDoc = !!files.length
  if (!hasIdDoc) return false
  const hasValidExpiryDate = moment(files[0].idValidationDateExpiry) > moment()
  return hasIdDoc && hasValidExpiryDate
}
