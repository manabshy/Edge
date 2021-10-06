import { moduleMetadata, componentWrapperDecorator } from '@storybook/angular'
import { CommonModule } from '@angular/common'
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0'
import { action } from '@storybook/addon-actions'
import { PureCompanyFinderShellComponent } from './pure-company-finder-shell.component'

export default {
  title: 'Components/PureCompanyFinderShellComponent/',
  component: PureCompanyFinderShellComponent,
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [PureCompanyFinderShellComponent],
      imports: [CommonModule],
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
  }
})

export const Primary = CompanyFinderTemplate.bind({})
Primary.args = {
  // searchResults: Company[]
  // existingCompany?: Company
  // companyNameError
  // canCreateNewCompany
  // hasBeenSearched
  // noSuggestions
  // suggestions: any
  // companyFinderForm
}
