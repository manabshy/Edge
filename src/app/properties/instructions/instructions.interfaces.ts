import { BaseRequestOption } from "src/app/shared/models/base-request-option";

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
  under_offer = 'Under Offer',
  under_offer_oa = 'Under Offer OA',
  end = 'End',
  exchanged = 'Exchanged',
  tom = 'TOM',
  completed = 'Completed'
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
  tableType: InstructionsTableType,
  instructions: Instruction[]
}

export enum InstructionsTableType {
  SALES = 'sales',
  LETTINGS = 'lettings'
}

export interface InstructionRequestOption extends BaseRequestOption {
  status?: number[]
  date?: string
  valuerId?: number[]
  officeId?: number[]
  departmentTypeId: number
}