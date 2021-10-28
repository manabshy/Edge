import { PeopleAutoCompleteResult } from './contact-group'

export const buildMatchedPeople = (person: any, potentialDuplicatePeople) => {
  const matches: PeopleAutoCompleteResult[] = []
  if (potentialDuplicatePeople.matches && potentialDuplicatePeople.matches.length) {
    potentialDuplicatePeople.matches.forEach((x) => {
      const matchedPerson = buildMatchedPerson(person, x)
      matches.push(matchedPerson)
    })
  }
  const potentialDupeResult = { ...person, matches }
  return potentialDupeResult
}

const buildMatchedPerson = (localPerson, apiPerson) => {
  let potentialMatch = apiPerson

  const firstName = potentialMatch.firstName ? potentialMatch.firstName.toLowerCase() : ''
  const middleName = potentialMatch.middleNames ? potentialMatch.middleNames.toLowerCase() : ''
  const lastName = potentialMatch.lastName ? potentialMatch.lastName.toLowerCase() : ''
  const fullName = middleName ? `${firstName} ${middleName} ${lastName} ` : `${firstName} ${lastName} `
  const sameName = fullName.toLowerCase().trim() === localPerson.fullName.toLowerCase().trim()
  const email = potentialMatch.emailAddresses ? potentialMatch.emailAddresses.filter((x) => x === localPerson.emailAddress) : []
  const phone = potentialMatch.phoneNumbers
    ? potentialMatch.phoneNumbers.filter((x) => (x === localPerson.phoneNumber ? localPerson.phoneNumber.replace(/\s+/g, '') : ''))
    : []
  const samePhone = phone[0] ? phone[0].toString() === localPerson.phoneNumber.replace(/\s+/g, '') : false
  const sameEmail = email[0] ? email[0].toLowerCase() === localPerson.emailAddress : false
  switch (true) {
    case sameName && sameEmail && samePhone:
      potentialMatch.matchScore = 10
      break
    case sameName && (sameEmail || samePhone):
      potentialMatch.matchScore = 7
      break
    default:
      potentialMatch.matchScore = 0
  }
  return potentialMatch
}
