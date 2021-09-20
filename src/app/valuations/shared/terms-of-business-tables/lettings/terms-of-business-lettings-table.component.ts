import { Component, Input } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-terms-of-business-table-lettings',
  template:`
  <div class="table">
     <table class="table--mobile table--rowHover">
      <thead>
        <tr>
          <th>Signed On</th>
          <th>Instruction Price Direction</th>
          <th>Short Lets Instruction</th>
          <th>Long Lets Instruction</th>
          <th>Management</th>
          <th>Zero Deposit</th>
          <th>Document(s)</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let val of data" (click)="openDocument(['detail', val?.valuationEventId, 'edit'])"
          data-cy="valuation">
          <td data-title="Signed On">
          <span class="cell-content">{{moment(val?.valuationDate).format('Do MMM YYYY (HH:mm)') || '-'}}</span>
          </td>
          <td data-title="Instruction Price Direction">
            <span class="cell-content">{{val.instructionPriceDirection}}</span>
          </td>
          <td data-title="Short Lets Instruction">
            <span class="cell-content">{{ val.shortLetsInstruction }}</span>
          </td>
          <td data-title="Long Lets Instruction">
            <span class="cell-content">{{ val.longLetsInstruction }}</span>
          </td>
          <td data-title="Management">
            <span class="cell-content">{{ val.management }}</span>
          </td>
          <td data-title="Zero Deposit">
            <span class="cell-content">{{ val.zeroDeposit }}</span>
          </td>
          <td data-title="Document(s)">
            <span class="cell-content" *ngIf="val.valuationFiles.length">
              <a href="{{val.valuationFiles[0].fileUri}}" target="_blank" style="color: #4DA685">
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
export class TermsOfBusinessTableLettingsComponent {
  @Input() data
  moment = moment
}