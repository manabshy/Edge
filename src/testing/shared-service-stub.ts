import { MockDropdownListInfo } from 'src/testing/fixture-data/test-helper/dropdown-list-data.json';
import { of } from 'rxjs';
import { SharedService } from 'src/app/core/services/shared.service';

export class SharedServiceStub extends SharedService {

  getDropdownListInfo() {
    return of(MockDropdownListInfo);
  }
}
