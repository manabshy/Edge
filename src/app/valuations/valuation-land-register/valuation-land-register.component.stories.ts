import { ValuationsLandRegisterComponent } from "./valuation-land-register.component";
import { moduleMetadata, componentWrapperDecorator } from "@storybook/angular";
import { CommonModule } from "@angular/common";
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/angular/types-6-0";

export default {
  title: "Valuations/LandRegister/valuation-land-register",
  component: ValuationsLandRegisterComponent,
  decorators: [
    moduleMetadata({
      declarations: [ValuationsLandRegisterComponent],
      imports: [CommonModule],
    }),
    componentWrapperDecorator(
      (story) => `
        <div style="margin: 3em">${story}</div>
      `
    ),
  ],
} as Meta;

const LettingsTemplate: Story<ValuationsLandRegisterComponent> = (
  args: ValuationsLandRegisterComponent
) => ({
  props: args,
});

export const SingleEntry = LettingsTemplate.bind({});
SingleEntry.args = {
  data: [
    {
      signedOn: new Date(),
      isShortLetInstruction: "Yes",
      isLongLetInstruction: "Yes",
      isManagement: "Yes",
      zeroDepositAccepted: "No",
      signatureFile: {
        fileUri: "http://www.google.co.uk",
      },
    },
  ],
};

export const MultipleEntry = LettingsTemplate.bind({});
MultipleEntry.args = {
  data: [
    {
      signedOn: new Date(),
      isShortLetInstruction: "Yes",
      isLongLetInstruction: "Yes",
      isManagement: "Yes",
      zeroDepositAccepted: "No",
      signatureFile: {
        fileUri: "http://www.google.co.uk",
      },
    },
    {
      signedOn: new Date(),
      isShortLetInstruction: "No",
      isLongLetInstruction: "No",
      isManagement: "No",
      zeroDepositAccepted: "Yes",
      signatureFile: {
        fileUri: "http://www.google.co.uk",
      },
    },
  ],
};
