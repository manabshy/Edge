import { moduleMetadata, componentWrapperDecorator } from "@storybook/angular";
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/angular/types-6-0";
import { FileUploadComponent } from "./file-upload.component";
import { action } from "@storybook/addon-actions";
import { VendorsModule } from "../../vendors.module";

export default {
  title: "Components/Shared/FileUpload",
  component: FileUploadComponent,
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [FileUploadComponent],
      imports: [CommonModule, VendorsModule, BrowserAnimationsModule],
    }),
    componentWrapperDecorator(
      (story) => `
        <div style="margin: 3em">${story}</div>
      `
    ),
  ],
} as Meta;

export const actionData = {
  getFiles: action('getFiles')
}
const FileUploadTemplate: Story<FileUploadComponent> = (
  args: FileUploadComponent
) => ({
  props: {
    ...args,
    getFiles: actionData.getFiles
  }
});

export const Primary = FileUploadTemplate.bind({});
Primary.args = {
  fileLimit: 1,
  fileType: '',
};
