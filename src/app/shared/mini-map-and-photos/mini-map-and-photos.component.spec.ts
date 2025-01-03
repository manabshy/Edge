import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MiniMapAndPhotosComponent } from './mini-map-and-photos.component';

describe('MiniMapAndPhotosComponent', () => {
  let component: MiniMapAndPhotosComponent;
  let fixture: ComponentFixture<MiniMapAndPhotosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniMapAndPhotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniMapAndPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
