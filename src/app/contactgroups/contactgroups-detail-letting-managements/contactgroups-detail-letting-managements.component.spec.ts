import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsDetailLettingManagementsComponent } from './contactgroups-detail-letting-managements.component';

describe('ContactgroupsDetailLettingManagementsComponent', () => {
  let component: ContactgroupsDetailLettingManagementsComponent;
  let fixture: ComponentFixture<ContactgroupsDetailLettingManagementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactgroupsDetailLettingManagementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupsDetailLettingManagementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
