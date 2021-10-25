import { Person } from '../../shared/models/person'

export enum DOCUMENT_TYPE {
  PROOF_OF_ADDRESS = 54,
  ID = 49,
  ADDITIONAL_DOCUMENTS = 50,
  REPORT = 51,
}

export interface ComplianceChecksState {
    checksAreValid: Boolean
    checkType: String // 'AML' || 'KYC'
    contactGroupId: Number
    companyOrContact?: String // 'company' || 'contact'
    message?: {
      type: String // 'warn' || 'info' || 'error'
      text: Array<string>
    }
    people: Array<ComplianceChecksPeople>
    compliancePassedDate: Date
    compliancePassedBy: String
    valuationEventId: Number
    companyId: Number
    isFrozen: Boolean
  }
  
  export interface ComplianceChecksPeople {
    id: Number
    personId: Number
    companyId: Number
    name: String
    address?: String
    position?: String
    documents: Array<any>
    isMain: Boolean
    isUBO?: Boolean
    personDateAmlCompleted?: Date
    compliancePassedBy?: String
  }
  
  export interface ComplianceDocTypes {
    idDoc: ComplianceDocs
    proofOfAddressDoc: ComplianceDocs
    reportDocs: ComplianceDocs
    additionalDocs: ComplianceDocs
  }
  
  export interface ComplianceDocs {
    label: String
    documentType: DOCUMENT_TYPE
    files: Array<any>
  }
  
  export interface FileUpdateEvent {
    ev: {
      tmpFiles: Array<any>
      documentType?: DOCUMENT_TYPE
      idValidationDateExpiry?: Date
    }
    person?: Person
  }
  
  export interface FileUpdate {
    tmpFiles: Array<any>
  }
  
  export interface FileDeletionPayload {
    ev: {
      id: Number
      documentType: DOCUMENT_TYPE
    }
    person: Person
  }