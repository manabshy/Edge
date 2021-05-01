import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImpersonateMemberComponent } from './impersonate-member.component';

describe('ImpersonateMemberComponent', () => {
  let component: ImpersonateMemberComponent;
  let fixture: ComponentFixture<ImpersonateMemberComponent>;

  beforeEach(waitForAsync(() => {
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
