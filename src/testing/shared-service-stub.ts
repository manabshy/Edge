import { of } from 'rxjs';
import { SharedService } from 'src/app/core/services/shared.service';
import { MockDropdownListInfo } from './fixture-data/dropdown-list-data.json';

export class SharedServiceStub extends SharedService {

  getDropdownListInfo() {
    return of(MockDropdownListInfo);
  }
}
