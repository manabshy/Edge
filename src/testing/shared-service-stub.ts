import { MockDropdownListInfo } from 'src/app/contactgroups/shared/test-helper/dropdown-list-data.json';
import { of } from 'rxjs';

export class SharedServiceStub {

  getDropdownListInfo() {
    return of(MockDropdownListInfo);
  }
}
