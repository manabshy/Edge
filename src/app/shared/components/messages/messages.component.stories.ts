import { moduleMetadata, componentWrapperDecorator  } from '@storybook/angular'
import { CommonModule } from '@angular/common'
import { Story, Meta } from '@storybook/angular/types-6-0'

// component under test
import { MessagesComponent } from './messages.component'

export default {
  title: 'Components/Shared/Messages',
  component: MessagesComponent,
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [MessagesComponent],
      imports: [CommonModule],
    }),
    componentWrapperDecorator((story)=> `
        <div class="w-full m-3">${story}</div>
      `
    )
  ],
  
} as Meta

const MessageTemplate: Story<MessagesComponent> = (args: MessagesComponent) => ({
  props: args
})

export const InfoMessage = MessageTemplate.bind({})
InfoMessage.args = {
  message:{
    type: 'info',
    text: ['Please carry out compliance checks', 'by uploading relevant valid documents.'],
  } 
}

export const SuccessMessage = MessageTemplate.bind({})
SuccessMessage.args = {
  message:{
    type: 'success',
    text: ['AML Completed', 'SmartSearch added: 7th Sep 2020 (11:45)'],
  } 
}

export const WarnMessage = MessageTemplate.bind({})
WarnMessage.args = {
  message:{
    type: 'warn',
    text: ['AML not yet completed', 'SmartSearch added: 7th Sep 2020 (11:45)'],
  } 
}
