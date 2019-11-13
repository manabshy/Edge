import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsCompanyEditComponent } from './contactgroups-company-edit.component';

describe('ContactgroupsCompanyEditComponent', () => {
  let component: ContactgroupsCompanyEditComponent;
  let fixture: ComponentFixture<ContactgroupsCompanyEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactgroupsCompanyEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupsCompanyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
