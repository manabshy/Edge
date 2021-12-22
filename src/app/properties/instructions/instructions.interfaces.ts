import { BaseRequestOption } from 'src/app/shared/models/base-request-option'

export enum InstructionViewingAndMarketingStatus {
  not_ready = 'Not Ready',
  ready = 'Ready',
  commenced = 'Commenced',
  stopped = 'Stopped'
}

export enum InstructionStatus {
  let = 'Let',
  withdrawn = 'Withdrawn',
  instructed = 'Instructed',
  underOffer = 'Under Offer',
  underOfferOtherAgent = 'Under Offer Other Agent',
  end = 'End',
  exchanged = 'Exchanged',
  tom = 'TOM',
  completed = 'Completed',
  notSet = 'Not Set',
  notOnMarket = 'Not On Market',
  valued = 'Valued',
  lapsed = 'Lapsed'
}

export interface InstructionTableCell {
  status: InstructionStatus
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
  salesStatus?: string[]
  lettingsStatus?: string[]
  dateFrom?: string
  valuerId?: number[]
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
  MarketingPrice = 'marketingPrice',
}
