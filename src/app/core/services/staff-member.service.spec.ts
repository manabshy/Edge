import { TestBed } from '@angular/core/testing';

import { StaffMemberService } from './staff-member.service';

describe('UserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StaffMemberService = TestBed.get(StaffMemberService);
    expect(service).toBeTruthy();
  });
});
