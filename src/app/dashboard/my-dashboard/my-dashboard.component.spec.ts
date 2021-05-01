import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyDashboardComponent } from './my-dashboard.component';

describe('MyDashboardComponent', () => {
  let component: MyDashboardComponent;
  let fixture: ComponentFixture<MyDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
