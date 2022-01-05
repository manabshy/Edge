import { BaseRequestOption } from 'src/app/shared/models/base-request-option'

export enum InstructionViewingAndMarketingStatus {
  notReady = 'NotReady',
  ready = 'Ready',
  commenced = 'Commenced',
  stopped = 'Stopped'
}


export const InstructionStatusForSalesAndLettings = {
  withdrawn: 'Withdrawn',
  instructed: 'Instructed',
  underOffer: 'Under Offer',
  exchanged: 'Exchanged'
}

export const InstructionStatusForSales = {
  ...InstructionStatusForSalesAndLettings,
  underOfferOtherAgent: 'Under Offer Other Agent',
  completed: 'Completed'
}

export const InstructionStatusForLettings = {
  ...InstructionStatusForSalesAndLettings,
  let: 'Let',
  end: 'End'
}

export enum InstructionStatusForSalesAndLettingsEnum {
  // Both
  withdrawn = 'Withdrawn',
  instructed = 'Instructed',
  underOffer = 'Under Offer',
  exchanged = 'Exchanged',
  // Sales
  underOfferOtherAgent = 'Under Offer Other Agent',
  completed = 'Completed',
  // Lettings
  let = 'Let',
  end = 'End'

  // Not in use right now - maybe later!
  // notSet = 'Not Set',
  // notOnMarket = 'Not On Market',
  // tom = 'TOM', // temporarily off market
  // valued = 'Valued',
  // lapsed = 'Lapsed'
}

export interface InstructionTableCell {
  status: InstructionStatusForSalesAndLettingsEnum
  address: string
  owner: string
  instructionDate: string
  lister: string
  viewingStatus: InstructionViewingAndMarketingStatus
  marketingStatus: InstructionViewingAndMarketingStatus
  marketingPrice?: string
  longLetPrice?: string
  shortLetPrice?: string
}

export interface Instruction extends InstructionTableCell {
  instructionEventId: number
}

export interface InstructionsStoreState {
  instructions: Instruction[]
  searchSuggestions: any[]
  searchStats: any
  listersForSelect: any[]
  officesForSelect: any[]
  statusesForSelect: any[]
  searchModel: InstructionRequestOption
}

export enum InstructionsTableType {
  SALES = 'salesInstruction',
  LETTINGS = 'lettingsInstruction',
  SALES_AND_LETTINGS = 'salesAndLettings'
}

export interface InstructionRequestOption extends BaseRequestOption {
  status?: string[]
  salesStatus?: string[]
  lettingsStatus?: string[]
  dateFrom?: string
  listerId?: number[]
  officeId?: number[]
  departmentType: string
  orderBy: string
}

export enum SortableColumnsForInstructions {
  PropertyAddress = 'address',
  PropertyOwner = 'owner',
  InstructionStatusId = 'status',
  InstructionLister = 'lister',
  VisibleOnWebsites = 'visibleOnWebsites',
  SearchableOnWebsite = 'searchableOnWebsite',
  InstructionDate = 'instructionDate',
  LongLetPrice = 'longLetPrice',
  ShortLetPrice = 'shortLetPrice',
  MarketingPrice = 'marketingPrice'
}
