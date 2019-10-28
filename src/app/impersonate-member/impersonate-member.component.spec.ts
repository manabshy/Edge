import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpersonateMemberComponent } from './impersonate-member.component';

describe('ImpersonateMemberComponent', () => {
  let component: ImpersonateMemberComponent;
  let fixture: ComponentFixture<ImpersonateMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpersonateMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpersonateMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
