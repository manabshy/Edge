import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsDetailOffersComponent } from './contactgroups-detail-offers.component';

describe('ContactgroupsDetailOffersComponent', () => {
  let component: ContactgroupsDetailOffersComponent;
  let fixture: ComponentFixture<ContactgroupsDetailOffersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactgroupsDetailOffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupsDetailOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
