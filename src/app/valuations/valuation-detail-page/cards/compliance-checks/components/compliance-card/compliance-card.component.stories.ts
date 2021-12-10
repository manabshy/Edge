import { moduleMetadata, componentWrapperDecorator } from '@storybook/angular'
import { CommonModule } from '@angular/common'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MessageService } from 'primeng/api'
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0'
import { action } from '@storybook/addon-actions'
import { VendorsModule } from 'src/app/shared/vendors.module'

// component under test
import { ComplianceCardComponent } from './compliance-card.component'

// document-info component and stories
import { DocumentInfoComponent } from '../document-info/document-info.component'
import {
  IdBlank,
  IdUploadedValid,
  IdUploadedInvalid,
  ProofOfAddressBlank,
  ProofOfAddressUploaded,
  ReportBlank,
  ReportUploaded,
  MultipleReportsUploaded,
  AdditionalDocumentsBlank,
  AdditionalDocumentUploaded,
  MultipleAdditionalDocumentsUploaded,
  LongNameDocumentsUploaded
} from '../document-info/document-info.component.stories'
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component'

export default {
  title: 'Valuations/Compliance/Components/ComplianceCard',
  excludeStories: /.*Data$/,
  component: ComplianceCardComponent,
  decorators: [
    moduleMetadata({
      declarations: [ComplianceCardComponent, DocumentInfoComponent, FileUploadComponent],
      imports: [CommonModule, VendorsModule, BrowserAnimationsModule],
      providers: [MessageService]
    }),
    componentWrapperDecorator(
      (story) => `
        <div class="m-10 w-full md:w-1/2 mx-auto shadow-md">${story}</div>
      `
    )
  ]
} as Meta

export const actionsData = {
  fileUploaded: action('fileUploaded'),
  fileDeleted: action('fileDeleted')
}
const ComplianceCardTemplate: Story<ComplianceCardComponent> = (args: ComplianceCardComponent) => ({
  props: {
    ...args,
    fileUploaded: actionsData.fileUploaded,
    fileDeleted: actionsData.fileDeleted
  }
})

// Lead entity stories
export const LeadContactBlank = ComplianceCardTemplate.bind({})
LeadContactBlank.args = {
  entity: {
    id: 123,
    personId: 123,
    isMain: true,
    name: 'Andrew Whitbread',
    address: 'Flat 4, Clarendon Square, Leamington Spa, CV32 5QX',
    personDateAmlCompleted: null,
    documents: {
      idDoc: IdBlank.args,
      proofOfAddressDoc: ProofOfAddressBlank.args,
      reportDocs: ReportBlank.args,
      additionalDocs: AdditionalDocumentsBlank.args
    }
  }
}

export const LeadContactValid = ComplianceCardTemplate.bind({})
LeadContactValid.args = {
  entity: {
    id: 456,
    personId: 456,
    isMain: true,
    name: 'Andrew Whitbread',
    address: 'Flat 4, Clarendon Square, Leamington Spa, CV32 5QX',
    personDateAmlCompleted: new Date('04/01/2020'),
    documents: {
      idDoc: IdUploadedValid.args,
      proofOfAddressDoc: ProofOfAddressUploaded.args,
      reportDocs: ReportUploaded.args,
      additionalDocs: AdditionalDocumentUploaded.args
    }
  }
}

export const LeadContactAndUBO = ComplianceCardTemplate.bind({})
LeadContactAndUBO.args = {
  entity: {
    id: 456,
    personId: 456,
    isUBO: true,
    isMain: true,
    name: 'Andrew Whitbread',
    address: 'Flat 4, Clarendon Square, Leamington Spa, CV32 5QX',
    personDateAmlCompleted: new Date('03/01/2020'),
    documents: {
      idDoc: IdUploadedValid.args,
      proofOfAddressDoc: ProofOfAddressUploaded.args,
      reportDocs: ReportUploaded.args,
      additionalDocs: AdditionalDocumentUploaded.args
    }
  }
}

export const LeadContactInvalid = ComplianceCardTemplate.bind({})
LeadContactInvalid.args = {
  entity: {
    id: 789,
    personId: 789,
    isMain: true,
    name: 'Andrew Whitbread',
    address: 'Flat 4, Clarendon Square, Leamington Spa, CV32 5QX',
    personDateAmlCompleted: null,
    documents: {
      idDoc: IdUploadedInvalid.args,
      proofOfAddressDoc: ProofOfAddressUploaded.args,
      reportDocs: ReportUploaded.args,
      additionalDocs: AdditionalDocumentsBlank.args
    }
  }
}

export const LeadContactMixed = ComplianceCardTemplate.bind({})
LeadContactMixed.args = {
  entity: {
    id: 101,
    personId: 101,
    isMain: true,
    name: 'Andrew Whitbread',
    address: 'Flat 4, Clarendon Square, Leamington Spa, CV32 5QX',
    personDateAmlCompleted: new Date('04/30/2020'),
    documents: {
      idDoc: IdUploadedValid.args,
      proofOfAddressDoc: ProofOfAddressUploaded.args,
      reportDocs: MultipleReportsUploaded.args,
      additionalDocs: MultipleAdditionalDocumentsUploaded.args
    }
  }
}

export const LeadContactLongFileNames = ComplianceCardTemplate.bind({})
LeadContactLongFileNames.args = {
  entity: {
    id: 101,
    personId: 101,
    isMain: true,
    name: 'Andrew Whitbread',
    address: 'Flat 4, Clarendon Square, Leamington Spa, CV32 5QX',
    personDateAmlCompleted: new Date('04/30/2020'),
    documents: {
      idDoc: IdUploadedValid.args,
      proofOfAddressDoc: ProofOfAddressUploaded.args,
      reportDocs: MultipleReportsUploaded.args,
      additionalDocs: LongNameDocumentsUploaded.args
    }
  }
}

// Associated entity stories
export const AssociatedContactBlank = ComplianceCardTemplate.bind({})
AssociatedContactBlank.args = {
  isFrozen: false,
  entity: {
    id: 121,
    personId: 121,
    isMain: false,
    name: 'Eddie Murphy',
    address: 'Scottich Parliament Building, Edinburgh, EH99 1SP',
    personDateAmlCompleted: null,
    documents: {
      idDoc: IdBlank.args,
      proofOfAddressDoc: ProofOfAddressBlank.args,
      reportDocs: ReportBlank.args,
      additionalDocs: AdditionalDocumentsBlank.args
    }
  }
}

export const AssociatedContactValid = ComplianceCardTemplate.bind({})
AssociatedContactValid.args = {
  isFrozen: false,
  entity: {
    id: 131,
    personId: 131,
    isMain: false,
    name: 'Ian Blackford',
    address: 'Scottich Parliament Building, Edinburgh, EH99 1SP',
    personDateAmlCompleted: new Date('02/21/2021'),
    documents: {
      idDoc: IdUploadedValid.args,
      proofOfAddressDoc: ProofOfAddressUploaded.args,
      reportDocs: MultipleReportsUploaded.args,
      additionalDocs: AdditionalDocumentsBlank.args
    }
  }
}

export const AssociatedContactInvalid = ComplianceCardTemplate.bind({})
AssociatedContactInvalid.args = {
  isFrozen: false,
  entity: {
    id: 415,
    personId: 415,
    isMain: false,
    name: 'Jack Black',
    address: 'Scottich Parliament Building, Edinburgh, EH99 1SP',
    personDateAmlCompleted: null,
    documents: {
      idDoc: IdUploadedInvalid.args,
      proofOfAddressDoc: ProofOfAddressUploaded.args,
      reportDocs: MultipleReportsUploaded.args,
      additionalDocs: AdditionalDocumentUploaded.args
    }
  }
}

export const CompanyContact = ComplianceCardTemplate.bind({})
CompanyContact.args = {
  isFrozen: false,
  entity: {
    id: 161,
    companyId: 161,
    name: 'Beazer Bungalows',
    position: 'Director',
    address: 'BBHQ, 1st Floor, High St, Ascot, SL5 1DK',
    personDateAmlCompleted: new Date('06/12/2020'),
    documents: {
      idDoc: IdBlank.args,
      proofOfAddressDoc: ProofOfAddressBlank.args,
      reportDocs: ReportBlank.args,
      additionalDocs: MultipleAdditionalDocumentsUploaded.args
    }
  }
}

export const AssociatedCompanyContact = ComplianceCardTemplate.bind({})
AssociatedCompanyContact.args = {
  isFrozen: false,
  entity: {
    id: 191,
    companyId: 161,
    name: 'Abacus Solicitors',
    position: 'CEO',
    address: 'Top Floor, The Gherkin, London, EC12 9HJ',
    personDateAmlCompleted: new Date('06/12/2020'),
    documents: {
      idDoc: IdBlank.args,
      proofOfAddressDoc: ProofOfAddressBlank.args,
      reportDocs: ReportBlank.args,
      additionalDocs: MultipleAdditionalDocumentsUploaded.args
    }
  }
}
