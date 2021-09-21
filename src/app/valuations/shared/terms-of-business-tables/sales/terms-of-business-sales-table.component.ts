import { Component, Input } from '@angular/core';
import moment from 'moment';
import { LettingsAgencyTypeEnum } from '../../../shared/valuation'
@Component({
  selector: 'app-terms-of-business-table-sales',
  template:`
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
        <tr *ngFor="let val of data" data-cy="valuation">
          <td data-title="Signed On">
            <span class="cell-content">{{moment(val?.signedOn).format('Do MMM YYYY (HH:mm)') || '-'}}</span>
          </td>
          <td data-title="Instruction Price Direction">
            <span class="cell-content">{{val.instructionPriceDirection | currency: 'GBP':'symbol':'3.0'}}</span>
          </td>
          <td data-title="Sole or Multi">
            <span class="cell-content" *ngIf="val.salesAgencyTypeId === LettingsAgencyTypeEnum.Sole">Sole</span>
            <span class="cell-content" *ngIf="val.salesAgencyTypeId === LettingsAgencyTypeEnum.Multi">Multi</span>
          </td>
          <td data-title="Document(s)">
            <span class="cell-content">
              <a href="{{val.signatureFile.fileUri}}" target="_blank" style="color: #4DA685">
                <i class="fa fa-file"></i>&nbsp;
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
export class TermsOfBusinessTableSalesComponent  {
  @Input() data
  moment = moment
  LettingsAgencyTypeEnum = LettingsAgencyTypeEnum
}
