import { MockDropdownListInfo } from 'src/app/contactgroups/shared/test-helper/dropdown-list-data.json';
import { of } from 'rxjs';

export class SharedServiceMock {

  getDropdownListInfo() {
    return of(MockDropdownListInfo);
  }
}
