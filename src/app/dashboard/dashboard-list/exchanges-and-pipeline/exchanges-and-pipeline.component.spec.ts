import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExchangesAndPipelineComponent } from './exchanges-and-pipeline.component';

describe('ExchangesAndPipelineComponent', () => {
  let component: ExchangesAndPipelineComponent;
  let fixture: ComponentFixture<ExchangesAndPipelineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangesAndPipelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangesAndPipelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
