import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsSearchComponent } from './contactgroups-search.component';

describe('ContactgroupsSearchComponent', () => {
  let component: ContactgroupsSearchComponent;
  let fixture: ComponentFixture<ContactgroupsSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactgroupsSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
