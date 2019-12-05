import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsDetailSearchesComponent } from './contactgroups-detail-searches.component';

describe('ContactgroupsDetailSearchesComponent', () => {
  let component: ContactgroupsDetailSearchesComponent;
  let fixture: ComponentFixture<ContactgroupsDetailSearchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactgroupsDetailSearchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupsDetailSearchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
