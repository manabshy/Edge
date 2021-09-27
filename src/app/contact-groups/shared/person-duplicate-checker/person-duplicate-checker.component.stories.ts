// import { moduleMetadata, componentWrapperDecorator  } from '@storybook/angular';
// import { CommonModule } from '@angular/common';
// import { action } from '@storybook/addon-actions'
// import { Story, Meta } from '@storybook/angular/types-6-0';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { VendorsModule } from '../../../shared/vendors.module';

// // component under test
// import { PersonDuplicateCheckerComponent } from './person-duplicate-checker.component';
// import { RouterModule, Router } from '@angular/router';
// import { ContactGroupsModule } from '../../contactgroups.module';
// import { ContactGroupsService } from '../contact-groups.service';
// import { SharedService } from 'src/app/core/services/shared.service';
// import { ContactGroupsComponentsModule } from '../../contactgroups.components.module';

// export default {
//   title: 'ContactGroups/Shared/PersonDuplicateCheckerComponent',
//   component: PersonDuplicateCheckerComponent,
//   excludeStories: /.*Data$/,
//   decorators: [
//     moduleMetadata({
//       declarations: [
//         PersonDuplicateCheckerComponent
//       ],
//       imports: [CommonModule, VendorsModule, BrowserAnimationsModule, RouterModule, ContactGroupsComponentsModule ],
//       providers: [Router, ContactGroupsService, SharedService]
//     }),
//     componentWrapperDecorator((story)=> `
//         <div style="margin: 3em">${story}</div>
//       `
//     )
//   ]
// } as Meta;

// export const actionsData = {
//     addedPersonDetails: action('addedPersonDetails'),
//     selectedPerson: action('selectedPerson'),
//     isCanvasHidden: action('isCanvasHidden'),
//     makeButtonVisible: action('makeButtonVisible'),
//     creatingNewPerson: action('creatingNewPerson'),
// }

// const Primary: Story<PersonDuplicateCheckerComponent> = (args: PersonDuplicateCheckerComponent) => ({
//   props: {
//     ...args,
//     addedPersonDetails: actionsData.addedPersonDetails,
//     selectedPerson: actionsData.selectedPerson,
//     isCanvasHidden: actionsData.isCanvasHidden,
//     makeButtonVisible: actionsData.makeButtonVisible,
//     creatingNewPerson: actionsData.creatingNewPerson     
//   } 
// });

// export const PrimaryComponent = Primary.bind({});
// PrimaryComponent.args = {
//     contactGroupDetails: {},
//     isOffCanvasVisible: false,
//     isCreateNewPerson: false,
//     searchTerm: ''
// };
