import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportantMessagesComponent } from './important-messages.component';

describe('ImportantMessagesComponent', () => {
  let component: ImportantMessagesComponent;
  let fixture: ComponentFixture<ImportantMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportantMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportantMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
