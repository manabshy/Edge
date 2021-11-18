import { Component, Input } from '@angular/core'
import moment from 'moment'
import { ToBDocument } from '../../../terms-of-business.component'

@Component({
  selector: 'app-terms-of-business-table-lettings',
  template: `
    <div class="table">
      <table class="table--mobile">
        <thead>
          <tr>
            <th>Signed On</th>
            <th>Management</th>
            <th>Zero Deposit</th>
            <th>Document(s)</th>
          </tr>
        </thead>
        <tbody>
          <tr data-cy="valuation">
            <td data-title="Signed On">
              <span class="cell-content">{{ moment(data?.signedOn).format('Do MMM YYYY (HH:mm)') || '-' }}</span>
            </td>
            <td data-title="Management">
              <span class="cell-content">{{ data?.isManagement ? 'Yes' : 'No' }}</span>
            </td>
            <td data-title="Zero Deposit">
              <span class="cell-content">{{ data?.zeroDepositAccepted ? 'Yes' : 'No' }}</span>
            </td>
            <td data-title="Document(s)">
              <span class="cell-content">
                <a href="{{ data?.signatureFile?.url }}" target="_blank" style="color: #4DA685">
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
export class TermsOfBusinessTableLettingsComponent {
  @Input() data: any
  moment = moment
}
