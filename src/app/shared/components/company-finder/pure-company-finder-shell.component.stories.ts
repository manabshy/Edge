import { moduleMetadata, componentWrapperDecorator } from '@storybook/angular'
import { CommonModule } from '@angular/common'
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0'
import { action } from '@storybook/addon-actions'
import { FormBuilder } from '@angular/forms'

import { PureCompanyFinderShellComponent } from './pure-company-finder-shell.component'

export default {
  title: 'Components/Shared/CompanyFinder/PureCompanyFinderShell',
  component: PureCompanyFinderShellComponent,
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [PureCompanyFinderShellComponent],
      imports: [CommonModule],
      providers: [FormBuilder],
    }),
    componentWrapperDecorator(
      (story) => `
        <div style="margin: 3em">${story}</div>
      `,
    ),
  ],
} as Meta

export const actionsData = {
  selectCompany: action('selectCompany'),
  selectedSuggestion: action('selectedSuggestion'),
  isManualEntry: action('isManualEntry'),
  createNew: action('createNew'),
  searchCompany: action('searchCompany'),
}

const CompanyFinderTemplate: Story<PureCompanyFinderShellComponent> = (args: PureCompanyFinderShellComponent) => ({
  props: {
    ...args,
    selectCompany: actionsData.selectCompany,
    selectedSuggestion: actionsData.selectedSuggestion,
    isManualEntry: actionsData.isManualEntry,
    createNew: actionsData.createNew,
    searchCompany: actionsData.searchCompany,
  },
})

export const SingleResult = CompanyFinderTemplate.bind({})
SingleResult.args = {
  searchResults: [
    {
      companyId: 7577,
      companyName: 'Abacus Solicitors',
      companyTypeId: 1,
    },
  ],
  companyNameError: 'None',
  canCreateNewCompany: true,
  hasBeenSearched: false,
  noSuggestions: true,
  suggestions: [],
}

export const MultipleResults = CompanyFinderTemplate.bind({})
MultipleResults.args = {
  searchResults: [
    {
      companyId: 7577,
      companyName: 'Abacus Solicitors',
      companyTypeId: 1,
    },
    {
      companyId: 7578,
      companyName: 'Abracadabra Lawyers',
      companyTypeId: 1,
    },
  ],
  companyNameError: 'None',
  canCreateNewCompany: true,
  hasBeenSearched: false,
  noSuggestions: true,
  suggestions: [],
}
