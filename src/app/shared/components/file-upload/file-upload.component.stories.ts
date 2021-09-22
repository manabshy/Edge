import { SharedModule } from "./../../shared.module";
import { moduleMetadata, componentWrapperDecorator } from "@storybook/angular";
import { CommonModule } from "@angular/common";
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/angular/types-6-0";
import { FileUploadComponent } from "./file-upload.component";

export default {
  title: "Components/FileUpload",
  component: FileUploadComponent,
  decorators: [
    moduleMetadata({
      declarations: [FileUploadComponent],
      imports: [CommonModule],
    }),
    componentWrapperDecorator(
      (story) => `
        <div style="margin: 3em">${story}</div>
      `
    ),
  ],
} as Meta;

const LettingsTemplate: Story<FileUploadComponent> = (
  args: FileUploadComponent
) => ({
  props: args,
});

export const SingleEntry = LettingsTemplate.bind({});
SingleEntry.args = {
  data: [
    {
      valuationDate: new Date(),
      instructionPriceDirection: "£890,000",
      shortLetsInstruction: "Yes",
      longLetsInstruction: "Yes",
      management: "Yes",
      zeroDeposit: "No",
      valuationFiles: [
        {
          fileUri: "http://www.google.co.uk",
        },
      ],
    },
  ],
};
