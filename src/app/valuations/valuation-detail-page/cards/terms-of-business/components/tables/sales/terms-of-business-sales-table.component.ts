import { Component, Input } from '@angular/core'
import moment from 'moment'
import { SalesAgencyTypeEnum } from '../../../../../../shared/valuation'

@Component({
  selector: 'app-terms-of-business-table-sales',
  template: `
    <div class="table">
      <table class="table--mobile">
        <thead>
          <tr>
            <th>Signed On</th>
            <th>Instruction Price Direction</th>
            <th>Sole or Multi</th>
            <th>Document(s)</th>
          </tr>
        </thead>
        <tbody>
          <tr data-cy="valuation">
            <td data-title="Signed On">
              <span class="cell-content">{{ moment(data?.signedOn).format('Do MMM YYYY (HH:mm)') || '-' }}</span>
            </td>
            <td data-title="Instruction Price Direction">
              <span class="cell-content">{{ data.instructionPriceDirection | currency: 'GBP':'symbol':'3.0' }}</span>
            </td>
            <td data-title="Sole or Multi">
              <span class="cell-content" *ngIf="data.salesAgencyTypeId === SalesAgencyTypeEnum.Sole">Sole</span>
              <span class="cell-content" *ngIf="data.salesAgencyTypeId === SalesAgencyTypeEnum.Multi">Multi</span>
            </td>
            <td data-title="Document(s)">
              <span class="cell-content">
                <a href="{{ data.signatureFile?.url }}" target="_blank" style="color: #4DA685">
                  <i class="fa fa-file"></i>
                  &nbsp;
                  <span class="underline">Terms of Business</span>
                </a>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class TermsOfBusinessTableSalesComponent {
  @Input() data: any

  moment = moment
  SalesAgencyTypeEnum = SalesAgencyTypeEnum
}
