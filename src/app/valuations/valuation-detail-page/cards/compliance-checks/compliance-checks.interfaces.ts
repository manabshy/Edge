import { Person } from '../../../../shared/models/person'

export enum DOCUMENT_TYPE {
  PROOF_OF_ADDRESS = 54,
  ID = 49,
  ADDITIONAL_DOCUMENTS = 50,
  REPORT = 51
}

export interface ComplianceChecksState {
  checksAreValid: boolean
  checkType: string // 'AML' || 'KYC'
  contactGroupId: number
  companyOrContact?: string // 'company' || 'contact'
  message?: {
    type: string // 'warn' || 'info' || 'error'
    text: Array<string>
  }
  entities: Array<ComplianceChecksPeople>
  compliancePassedDate: Date
  compliancePassedBy: string
  valuationEventId: number
  companyId: number
  isFrozen: boolean
}

export interface ComplianceChecksPeople {
  id: number
  personId: number
  companyId: number
  name: string
  address?: string
  position?: string
  documents: Array<any>
  isMain: boolean
  isUBO?: boolean
  personDateAmlCompleted?: Date
  compliancePassedBy?: string
}

export interface ComplianceDocTypes {
  idDoc: ComplianceDocs
  proofOfAddressDoc: ComplianceDocs
  reportDocs: ComplianceDocs
  additionalDocs: ComplianceDocs
}

export interface ComplianceDocs {
  label: string
  documentType: DOCUMENT_TYPE
  files: Array<any>
}

export interface FileUpdateEvent {
  ev: {
    tmpFiles: Array<any>
    documentType?: DOCUMENT_TYPE
    idValidationDateExpiry?: Date
  }
  entity?: Person
}

export interface FileUpdate {
  tmpFiles: Array<any>
}

export interface FileDeletionPayload {
  ev: {
    id: number
    documentType: DOCUMENT_TYPE
  }
  entity: Person
}

export interface ValuationComplianceChecks {
  compliancePassedByFullName: string
  compliancePassedDate: Date
}

interface companyComplianceChecksGroup {
  companyId: string
  companyDocuments: any[]
  personDocuments: any[]
}

export interface CompanyComplianceChecksSavePayload {
  savePayload: companyComplianceChecksGroup
  contactGroupId: number
  companyOrContact: string
}

interface contactComplianceChecksGroup{
  personDocuments: any[]
}
export interface ContactComplianceChecksSavePayload {
  savePayload: contactComplianceChecksGroup
  companyOrContact: string
  contactGroupId: number
}
