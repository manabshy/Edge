export const MockCountries = [
  { id: 232, value: 'United Kingdom', parentId: null },
  { id: 1, value: 'Afghanistan', parentId: null },
  { id: 2, value: 'Åland Islands', parentId: null },
  { id: 3, value: 'Albania', parentId: null },
  { id: 4, value: 'Algeria', parentId: null },
  { id: 5, value: 'American Samoa', parentId: null },
  { id: 6, value: 'Andorra', parentId: null },
  { id: 7, value: 'Angola', parentId: null },
  { id: 8, value: 'Anguilla', parentId: null },
  { id: 9, value: 'Antartica', parentId: null }
];
export const MockDropdownListInfo = {
  result: {
    countries: [
      { id: 232, value: 'United Kingdom', parentId: null },
      { id: 1, value: 'Afghanistan', parentId: null },
      { id: 206, value: 'Spain', parentId: null },
    ],
    titles: {
      '1': 'Mr',
      '2': 'Mrs',
      '3': 'Miss',
      '4': 'Ms',
      '5': 'Lady',
      '6': 'Sir',
      '7': 'Dr',
      '8': 'Lord',
      '100': 'Other'
    },
    telephoneTypes: {
      '1': 'Home',
      '2': 'Work',
      '3': 'Mobile',
      '4': 'Fax',
      '5': 'Other'
    },
    companyTypes: [
      { id: 1, value: 'Company', parentId: null },
      { id: 2, value: 'Other Agent', parentId: null },
      { id: 16, value: 'Property Developer', parentId: null },
      { id: 4, value: 'Relocation Agent', parentId: null },
      { id: 8, value: 'Tradesmen', parentId: null }
    ],
    propertyTypes: [
      { id: 1, value: 'House', parentId: null },
      { id: 2, value: 'Flat', parentId: null }
    ],
    propertyStyles: [
      { id: 1, value: 'Semi-Detached', parentId: 1 },
      { id: 2, value: 'Detached', parentId: 1 },
      { id: 3, value: 'Terraced', parentId: 1 },
      { id: 4, value: 'End Of Terrace', parentId: 1 },
      { id: 6, value: 'Mews', parentId: 1 },
      { id: 5, value: 'Mansion', parentId: 2 },
      { id: 14, value: 'Maisonette', parentId: 2 },
      { id: 7, value: 'Purpose Built', parentId: 2 },
      { id: 8, value: 'Conversion', parentId: 2 },
      { id: 9, value: 'Period Purpose Built', parentId: 2 },
      { id: 12, value: 'Houseboat', parentId: 2 },
      { id: 10, value: 'Garage', parentId: 2 },
      { id: 13, value: 'Land', parentId: 2 },
      { id: 11, value: 'Parking Space', parentId: 2 }
    ],
    regions: [
      { id: 1, value: 'London', parentId: null },
      { id: 2, value: 'Residential Developments', parentId: null }
    ],
    areas: [
      { id: 8, value: 'Balham', parentId: 1 },
      { id: 7, value: 'Battersea', parentId: 1 },
      { id: 5, value: 'BPR', parentId: 1 },
      { id: 3, value: 'Chelsea', parentId: 1 },
      { id: 9, value: 'Clapham', parentId: 1 },
      { id: 1, value: 'Fulham', parentId: 1 },
      { id: 11, value: 'Hammersmith', parentId: 1 },
      { id: 10, value: 'Kensington', parentId: 1 },
      { id: 12, value: 'Notting Hill', parentId: 1 },
      { id: 2, value: 'Pimlico', parentId: 1 },
      { id: 6, value: 'Putney', parentId: 1 },
      { id: 4, value: 'Sth Kensington', parentId: 1 },
      { id: 13, value: 'Southfields and Earlsfield', parentId: 1 },
      { id: 14, value: 'Streatham', parentId: 1 },
      { id: 61, value: 'Queens Park & Kensal Rise', parentId: 1 },
      { id: 59, value: 'Central London', parentId: 2 },
      { id: 53, value: 'City', parentId: 2 },
      { id: 52, value: 'Docklands', parentId: 2 },
      { id: 51, value: 'East London', parentId: 2 },
      { id: 60, value: 'Greater London', parentId: 2 },
      { id: 55, value: 'North London', parentId: 2 },
      { id: 54, value: 'North West London', parentId: 2 },
      { id: 50, value: 'South East London', parentId: 2 },
      { id: 58, value: 'South West London', parentId: 2 },
      { id: 56, value: 'West End', parentId: 2 },
      { id: 57, value: 'West London', parentId: 2 }
    ],
    subAreas: [
      { id: 1, value: 'Nth of Fulham Rd', parentId: 1 },
      { id: 2, value: 'Sth Fulham Rd', parentId: 1 },
      { id: 2, value: 'Belgravia', parentId: 2 },
      { id: 1, value: 'Westminster', parentId: 2 },
      { id: 1, value: 'SW1', parentId: 3 },
      { id: 2, value: 'SW3', parentId: 3 },
      { id: 3, value: 'SW5 (Chelsea)', parentId: 3 },
      { id: 4, value: 'SW7 (Chelsea)', parentId: 3 },
      { id: 5, value: 'SW10', parentId: 3 },
      { id: 1, value: 'SW5 (Sth Kensington)', parentId: 4 },
      { id: 2, value: 'SW7 (Sth Kensington)', parentId: 4 },
      { id: 4, value: 'SW10', parentId: 4 },
      { id: 3, value: 'W8 (Sth Kensington)', parentId: 4 },
      { id: 5, value: 'W14', parentId: 4 },
      { id: 1, value: 'Nth BPR', parentId: 5 },
      { id: 2, value: 'Sth BPR', parentId: 5 },
      { id: 2, value: 'East Putney', parentId: 6 },
      { id: 1, value: 'West Putney', parentId: 6 },
      { id: 1, value: 'Between The Commons', parentId: 7 },
      { id: 2, value: 'Other Areas (Battersea)', parentId: 7 },
      { id: 1, value: 'Nightingale Triangle', parentId: 8 },
      { id: 3, value: 'Streatham', parentId: 8 },
      { id: 4, value: 'Tooting', parentId: 8 },
      { id: 2, value: 'Other Areas (Balham)', parentId: 8 },
      { id: 1, value: 'Abbeville Rd', parentId: 9 },
      { id: 3, value: 'Brixton', parentId: 9 },
      { id: 2, value: 'Other Areas (Clapham)', parentId: 9 },
      { id: 2, value: 'W2 (Kensington)', parentId: 10 },
      { id: 1, value: 'W8 (Kensington)', parentId: 10 },
      { id: 3, value: 'W11 (Kensington)', parentId: 10 },
      { id: 5, value: 'W14 (Kensington)', parentId: 10 },
      { id: 6, value: 'W1H', parentId: 10 },
      { id: 5, value: 'Acton', parentId: 11 },
      { id: 12, value: 'Askew Village', parentId: 11 },
      { id: 10, value: 'Barons Court', parentId: 11 },
      { id: 1, value: 'Brackenbury Village', parentId: 11 },
      { id: 2, value: 'Brook Green', parentId: 11 },
      { id: 3, value: 'Central Hammersmith', parentId: 11 },
      { id: 6, value: 'Chiswick', parentId: 11 },
      { id: 7, value: 'Ealing', parentId: 11 },
      { id: 8, value: 'Ravenscourt Park', parentId: 11 },
      { id: 11, value: 'Stamford Brook', parentId: 11 },
      { id: 4, value: 'Shepherds Bush', parentId: 11 },
      { id: 9, value: 'W14', parentId: 11 },
      { id: 1, value: 'W2 (Notting Hill)', parentId: 12 },
      { id: 5, value: 'W9', parentId: 12 },
      { id: 4, value: 'W10', parentId: 12 },
      { id: 3, value: 'W11 (Notting Hill)', parentId: 12 },
      { id: 2, value: 'W14 (Notting Hill)', parentId: 12 },
      { id: 6, value: 'NW10', parentId: 12 },
      { id: 7, value: 'N1C', parentId: 12 },
      { id: 1, value: 'The Grid', parentId: 13 },
      { id: 2, value: 'Southfields other', parentId: 13 },
      { id: 3, value: 'Earlsfield', parentId: 13 },
      { id: 7, value: 'Raynes Park', parentId: 13 },
      { id: 4, value: 'Wimbledon', parentId: 13 },
      { id: 5, value: 'Wimbledon Park', parentId: 13 },
      { id: 6, value: 'Wandsworth', parentId: 13 },
      { id: 1, value: 'Furzedown', parentId: 14 },
      { id: 2, value: 'Streatham Common', parentId: 14 },
      { id: 3, value: 'Streatham Vale', parentId: 14 },
      { id: 4, value: 'Streatham Hill', parentId: 14 },
      { id: 5, value: 'West Norwood', parentId: 14 },
      { id: 1, value: 'Queens Park', parentId: 61 },
      { id: 2, value: 'Kensal Rise', parentId: 61 },
      { id: 3, value: 'Kensal Green', parentId: 61 },
      { id: 4, value: 'Brondesbury Park', parentId: 61 },
      { id: 5, value: 'Maida Hill', parentId: 61 },
      { id: 6, value: 'Willesden Green', parentId: 61 },
      { id: 2, value: 'Greenwich', parentId: 50 },
      { id: 1, value: 'South Bank', parentId: 50 },
      { id: 1, value: 'East London', parentId: 51 },
      { id: 2, value: 'Docklands', parentId: 52 },
      { id: 1, value: 'City', parentId: 53 },
      { id: 1, value: 'North West London', parentId: 54 },
      { id: 1, value: 'North London', parentId: 55 },
      { id: 1, value: 'West End', parentId: 56 },
      { id: 2, value: 'Acton, Chiswick and Ealing', parentId: 57 },
      { id: 1, value: 'Paddington and St Johns Wood', parentId: 57 },
      { id: 2, value: 'Chelsea and Fulham', parentId: 58 },
      { id: 1, value: 'Clapham, Battersea and Wandsworth', parentId: 58 },
      { id: 3, value: 'Tooting, Balham and Streatham', parentId: 58 },
      { id: 1, value: 'Zone 1', parentId: 59 },
      { id: 2, value: 'Zone 2 (North of river)', parentId: 59 },
      { id: 3, value: 'Zone 2 (South of river)', parentId: 59 },
      { id: 1, value: 'Greater London', parentId: 60 }
    ],
    personWarningStatuses: [
      { id: 1, value: 'None', parentId: null },
      { id: 2, value: 'Deceased', parentId: null },
      { id: 3, value: 'GDPR Removal', parentId: null },
      { id: 4, value: 'No contact wanted', parentId: null },
      { id: 5, value: 'Abusive', parentId: null },
      { id: 100, value: 'Other', parentId: null }
    ],
    tenures: [
      { id: 1, value: 'None', parentId: null },
      { id: 2, value: 'Deceased', parentId: null },
    ],
    outsideSpaces: [
      { id: 1, value: 'None', parentId: null },
      { id: 2, value: 'Deceased', parentId: null },
    ],
    parkings: [
      { id: 1, value: 'None', parentId: null },
      { id: 2, value: 'Deceased', parentId: null },
    ],
    features: [
      { id: 1, value: 'None', parentId: null },
      { id: 2, value: 'Deceased', parentId: null },
    ],
    allOrigins: [
      { id: 1, value: 'None', parentId: null },
      { id: 2, value: 'Deceased', parentId: null },
    ],
    allOriginTypes: [
      { id: 1, value: 'None', parentId: null },
      { id: 2, value: 'Deceased', parentId: null },
    ],
    diaryEventTypes: [
      { id: 1, value: 'Viewing - Sales' },
      { id: 1024, value: 'Viewing - Lettings' },
      { id: 8, value: 'Valuation - Sales' },
      { id: 2048, value: 'Valuation - Lettings' },
      { id: 8192, value: 'Preview - Sales' },
      { id: 16384, value: 'Preview - Lettings' },
      { id: 16, value: 'No Appointments' },
      { id: 2, value: 'Meeting' }
    ]
  }
};

// this.tenures = info.tenures;
//     this.outsideSpaces = info.outsideSpaces;
//     this.parkings = info.parkings;
//     this.features = info.propertyFeatures;
//     this.allOrigins = info.origins;
//     this.allOriginTypes = info.originTypes;