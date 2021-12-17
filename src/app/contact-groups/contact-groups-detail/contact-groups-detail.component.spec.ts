import { CurrencyPipe } from '@angular/common'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader'
import { BsModalService } from 'ngx-bootstrap/modal'
import { PositioningService } from 'ngx-bootstrap/positioning'
import { DialogService } from 'primeng/dynamicdialog'
import { SharedService } from 'src/app/core/services/shared.service'

import { ContactgroupsDetailComponent } from './contact-groups-detail.component'

describe('ContactgroupsDetailComponent', () => {
  let component: ContactgroupsDetailComponent
  let fixture: ComponentFixture<ContactgroupsDetailComponent>
  let sharedService;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule],
        providers: [
          { provide: DialogService },
          { provide: SharedService, usevalue: sharedService },
          { provide: BsModalService },
          ComponentLoaderFactory,
          PositioningService,
          CurrencyPipe
        ],
        declarations: [ContactgroupsDetailComponent]
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupsDetailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
