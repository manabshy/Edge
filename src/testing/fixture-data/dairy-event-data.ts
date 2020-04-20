export const mockDiaryEvents = [
  {
    diaryEventId: 1582490,
    startDateTime: '2020-03-11T13:45:00',
    endDateTime: '2020-03-11T14:45:00',
    totalHours: 1,
    eventTypeId: 1,
    eventType: 'Viewing - Sales',
    subject: 'Viewing - Sales',
    notes: 'Test again with two properties',
    location: null,
    allDay: false,
    isCancelled: false,
    isConfirmed: true,
    isHighImportance: false,
    isPrivate: false,
    isOrganizer: true,
    isBusy: false,
    onEdge: true,
    onOutlook: false,
    exchangeGUID: null,
    staffMembers: [

      {
        staffMemberId: 1474,
        fullName: 'Lynn Walker',
        emailAddress: null,
        hasReminder: false,
        reminderUnits: null,
        reminderUnitType: null
      },
      {
        staffMemberId: 2523,
        fullName: 'Alex Agyapong',
        emailAddress: null,
        hasReminder: true,
        reminderUnits: 30,
        reminderUnitType: 0
      }
    ],
    contacts: [
      {
        contactGroupId: 75197,
        contactPeople: [
          {
            personId: 81422,
            titleId: 2,
            titleOther: '',
            firstName: 'Wendy',
            middleName: '',
            lastName: 'Younges',
            addressee: 'Mrs Wendy Younges',
            salutation: 'Mrs Younges',
            phoneNumbers: ['07980643194'],
            emailAddresses: ['wyounge@dng.co.uk']
          }
        ]
      },
      {
        contactGroupId: 131206,
        contactPeople: [
          {
            personId: 137244,
            titleId: 3,
            titleOther: '',
            firstName: 'Wendy',
            middleName: '',
            lastName: 'Shaw',
            addressee: 'Miss Wendy Shaw',
            salutation: 'Miss Shaw',
            phoneNumbers: ['07525393552'],
            emailAddresses: ['wendy.shaw@bauermedia.co.uk']
          }
        ]
      }
    ],

    properties: [

      {
        propertyId: 32724,
        propertySaleId: null,
        propertyLettingId: null,
        propertyEventId: null,
        viewingArragementId: 0,
        address: {

          flatNumber: '592a',
          houseNumber: null,
          houseBuildingName: null,
          streetName: 'Kings Road',
          addressLine2: 'New Kings Road',
          town: 'London',
          outCode: 'SW6',
          inCode: '2DX',
          postCode: 'SW6 2DX',
          coordinate: null
        }
      },
      {
        propertyId: 67997,
        propertySaleId: null,
        propertyLettingId: null,
        propertyEventId: null,
        viewingArragementId: 0,
        address: {

          flatNumber: '8',
          houseNumber: null,
          houseBuildingName: 'Newtown Court',
          streetName: 'Newtown Street',
          addressLine2: null,
          town: 'London',
          outCode: 'SW11',
          inCode: '5HH',
          postCode: 'SW11 5HH',
          coordinate: null
        }
      }
    ]


  }
];
