import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsCompanyFinderComponent } from './contactgroups-company-finder.component';

describe('ContactgroupsCompanyFinderComponent', () => {
  let component: ContactgroupsCompanyFinderComponent;
  let fixture: ComponentFixture<ContactgroupsCompanyFinderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactgroupsCompanyFinderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupsCompanyFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
