import { HttpClient } from "@angular/common/http";
import { moduleMetadata, componentWrapperDecorator } from "@storybook/angular";
import { CommonModule } from "@angular/common";
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/angular/types-6-0";
import { CancelValuationComponent } from "./cancel-valuation.component";
import { InfoService } from "src/app/core/services/info.service";
import { APP_INITIALIZER } from "@angular/core";
import { VendorsModule } from "src/app/shared/vendors.module";

export default {
  title: "Components/cancel-valuation",
  component: CancelValuationComponent,
  decorators: [
    moduleMetadata({
      declarations: [CancelValuationComponent],
      imports: [CommonModule, VendorsModule],
    }),
    componentWrapperDecorator(
      (story) => `
        <div style="margin: 3em">${story}</div>
      `
    ),
  ],
} as Meta;

function initInfo(infoService: InfoService) {
  return () => infoService.getDropdownListInfo();
}

const CancelValuation: Story<CancelValuationComponent> = (
  args: CancelValuationComponent
) => ({
  moduleMetadata: {
    providers: [
      {
        provide: APP_INITIALIZER,
        useFactory: initInfo,
        multi: true,
        deps: [InfoService],
      },
    ],
  },
  component: CancelValuationComponent,
  props: args,
});

export const Cancel = CancelValuation.bind({});
Cancel.args = {
  data: [],
};
