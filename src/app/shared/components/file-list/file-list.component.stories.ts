import { SharedModule } from "./../../shared.module";
import { moduleMetadata, componentWrapperDecorator } from "@storybook/angular";
import { CommonModule } from "@angular/common";
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/angular/types-6-0";
import { FileListComponent } from "./file-list.component";
import { VendorsModule } from "../../vendors.module";
import { action } from "@storybook/addon-actions";

export default {
  title: "Components/file-list",
  excludeStories: /.*Data$/,
  component: FileListComponent,
  decorators: [
    moduleMetadata({
      declarations: [FileListComponent],
      imports: [CommonModule, VendorsModule],
    }),
    componentWrapperDecorator(
      (story) => `
        <div style="margin: 3em">${story}</div>
      `
    ),
  ],
} as Meta;

export const actionsData = {
  deleteFile: action("deleteFilePlease"),
};

const fileListTemplate: Story<FileListComponent> = (
  args: FileListComponent
) => ({
  props: {
    ...args,
    deleteFile: actionsData.deleteFile,
  },
});

export const SingleEntry = fileListTemplate.bind({});
SingleEntry.args = {
  header: "Title Deeds",
  files: [
    {
      header: "Title Deeds",
      name: "fdsafffaf",
      description: "Uploaded: 10th Sep 2020 (13:44)",
    },
  ],
};

export const NoEntry = fileListTemplate.bind({});
NoEntry.args = {
  header: "Title Deeds",
  files: [],
};
