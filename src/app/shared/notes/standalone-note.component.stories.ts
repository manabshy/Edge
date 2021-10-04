import { moduleMetadata, componentWrapperDecorator } from "@storybook/angular";
import { CommonModule } from "@angular/common";
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/angular/types-6-0";
import { action } from "@storybook/addon-actions";
import { VendorsModule } from "../vendors.module";
import { StandAloneNoteComponent } from "./standalone-note.component";

export default {
  title: "Components/StandAlone-Note",
  excludeStories: /.*Data$/,
  component: StandAloneNoteComponent,
  decorators: [
    moduleMetadata({
      declarations: [StandAloneNoteComponent],
      imports: [CommonModule, VendorsModule],
    }),
    componentWrapperDecorator(
      (story) => `
        <div style="margin: 3em">${story}</div>
      `
    ),
  ],
} as Meta;

const standAloneNotes: Story<StandAloneNoteComponent> = (
  args: StandAloneNoteComponent
) => ({
  props: {
    ...args,
  },
});

export const valuationsNotes = standAloneNotes.bind({});
valuationsNotes.args = {
  isEditMode: false,
  isNewMode: false,
};
