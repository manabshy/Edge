import { DOCUMENT_TYPE } from './components/document-info/document-info.component'
import { Person } from '../../shared/models/person'

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
  }
  
  export interface ComplianceChecksPeople {
    originalId: String
    personId: String
    companyId: String
    name: String
    address?: String
    position?: String
    documents: Array<any>
    isMain: Boolean
    isUBO?: Boolean
    personDateAmlcompleted?: Date
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