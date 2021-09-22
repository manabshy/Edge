import { moduleMetadata, componentWrapperDecorator  } from '@storybook/angular';
import { CommonModule } from '@angular/common';
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';

import { CalendarComponent } from './calendar.component';

export default {
  title: 'Components/Calendar',
  component: CalendarComponent,
  decorators: [
    moduleMetadata({
      declarations: [CalendarComponent],
      imports: [CommonModule],
    }),
    componentWrapperDecorator((story)=> `
        <div style="margin: 3em">${story}</div>
      `
    )
  ],
  
} as Meta;

const CalendarTemplate: Story<CalendarComponent> = (args: CalendarComponent) => ({
  props: args,
});

export const SingleEntry = CalendarTemplate.bind({});
SingleEntry.args = {
    staffMemberId:1,
    myCalendarOnly: false,
    isSelectingDate: false,
    isOnlyShowPurposes: false,
    selectedDate: ()=>{},
    view: 'month',
    selectedStaffMemberId: 123
};
