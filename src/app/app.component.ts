import { MsalService } from '@azure/msal-angular'
import { Component, Renderer2, ChangeDetectorRef, OnInit, ViewChild, ElementRef } from '@angular/core'
import { Router, RoutesRecognized, ActivatedRoute, NavigationEnd } from '@angular/router'
import { filter, pairwise, takeUntil } from 'rxjs/operators'
import { AppUtils } from './core/shared/utils'
import { AuthService } from './core/services/auth.service'
import { SharedService, WedgeError } from './core/services/shared.service'
import { StaffMemberService } from './core/services/staff-member.service'
import { StaffMember } from './shared/models/staff-member'
import { ToastContainerDirective, ToastrService } from 'ngx-toastr'
import { EdgeServiceWorkerService } from './core/services/edge-service-worker.service'
import { BaseComponent } from './shared/models/base-component'
import { DropdownListInfo, InfoService } from './core/services/info.service'
import { StorageMap } from '@ngx-pwa/local-storage'
import { environment } from 'src/environments/environment'
import manifest from 'src/manifest.json'
import { ConfigsLoaderService } from './configs-loader.service'
import { BaseStaffMember } from './shared/models/base-staff-member'
import { BsLocaleService } from 'ngx-bootstrap/datepicker'
import { SignalRService } from './core/services/signal-r.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent implements OnInit {
  title = 'Wedge'
  isFading = false
  isCurrentUserAvailable = false
  currentStaffMember: StaffMember
  listInfo: any
  locale = 'en-gb'

  // Side nav config
  showDashboardPages = true
  dashboardPages = [
    {
      url: '',
      name: 'Calendar'
    }
  ]

  showContactPages = true
  contactPages = [
    {
      url: 'contact-centre',
      name: 'Contact centre'
    },
    {
      url: 'company-centre',
      name: 'Company centre'
    },
    {
      url: 'leads',
      name: 'Leads'
    }
  ]

  showPropertyPages = true
  propertyPages = [
    {
      url: 'property-centre',
      name: 'Property centre'
    },
    {
      url: 'valuations',
      name: 'Valuations'
    },
    {
      url: 'instructions',
      name: 'Instructions'
    }
  ]
  // end sidenav config

  loginRequest = {
    scopes: ['User.ReadWrite']
  }

  @ViewChild('appContainer', { static: true }) appContainer: ElementRef
  @ViewChild(ToastContainerDirective, { static: true }) toastContainer: ToastContainerDirective

  get isLoggedIn(): boolean {
    return this.authService.checkAccount()
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    public msalService: MsalService,
    protected sharedService: SharedService,
    private infoService: InfoService,
    private storage: StorageMap,
    protected staffMemberService: StaffMemberService,
    private localeService: BsLocaleService,
    private configLoaderService: ConfigsLoaderService,
    private edgeServiceWorker: EdgeServiceWorkerService,
    private renderer: Renderer2,
    private toastr: ToastrService,
    private serviceWorker: EdgeServiceWorkerService,
    private cdRef: ChangeDetectorRef,
    public signalRService: SignalRService
  ) {
    super()
    this.localeService.use(this.locale)
    this.setupEnvironmentVariables()
    this.setIsFadingFlag()
    this.updateOnAllowedRoutes()

    setTimeout(() => {
      if (this.isLoggedIn) {
        this.getCurrentStaffMember()
        this.getInfo()
      } else {
        this.msalService.loginRedirect(this.loginRequest)
      }
    }, 1000)
  }

  /*  DELETE ASAP IF NOT USED 25/03/21  */
  private setIsFadingFlag() {
    this.router.events
      .pipe(filter((e) => e instanceof RoutesRecognized))
      .pipe(
        pairwise()
        // tap((data) => console.log('events here....', data))
      )
      .subscribe((event: any[] | RoutesRecognized[]) => {
        AppUtils.prevRouteBU = AppUtils.prevRoute || ''
        AppUtils.prevRoute = event[0].urlAfterRedirects
        const current = event[1].urlAfterRedirects

        if (current.indexOf('calendarView') === -1) {
          this.isFading = true
        }
        setTimeout(() => {
          this.isFading = false
        }, 1200)
      })
  }

  private updateOnAllowedRoutes() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((event: any | NavigationEnd) => {
      const current = event.urlAfterRedirects
      // console.log('isupdateAvailable: ', this.serviceWorker.isUpdateAvailable);
      // console.log('current Patch: ', current);
      // console.log('condition:', current === '/' && this.serviceWorker.isUpdateAvailable);

      const homes = ['/', '/contact-centre', '/leads', '/company-centre', '/property-centre', '/valuations']
      const pathEqual = (elem) => elem === current
      if (homes.some(pathEqual) && this.serviceWorker.getIsupdateAvailable()) {
        // console.log('App relaod because of update')
        window.location.reload()
      }
    })
  }

  ngOnInit() {
    this.toastr.overlayContainer = this.toastContainer
    this.setManifestName()
    this.setImpersonatedAsCurrentUser()
    this.storage.delete('calendarStaffMembers').subscribe() // Remove from localstorage
    this.signalRService.startConnection()
    this.signalRService.addRewardsDataListener()

    this.route.queryParams.subscribe((params) => {
      if (params['docTitle']) {
        this.sharedService.setTitle(params['docTitle'])
        AppUtils.navPlaceholder = params['docTitle']
        AppUtils.navPlaceholder = AppUtils.navPlaceholder.substring(AppUtils.navPlaceholder.indexOf('|') + 1).trim()
      }
    })
  }

  private setImpersonatedAsCurrentUser() {
    this.staffMemberService.impersonatedStaffMember$.subscribe((person: BaseStaffMember) => {
      if (person) {
        // console.log({ person }, 'for new impersonated person');
        this.storage.delete('currentUser').subscribe(() => {
          this.getCurrentStaffMember()
          window.location.reload()
        })
      }
    })
  }

  private getCurrentStaffMember() {
    this.storage.get('currentUser').subscribe((staffMember: StaffMember) => {
      if (staffMember) {
        this.currentStaffMember = staffMember
        // console.log('current user from storage here....', staffMember);
      } else {
        this.staffMemberService
          .getCurrentStaffMember()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(
            (data) => {
              if (data) {
                this.currentStaffMember = data
                this.isCurrentUserAvailable = true
                AppUtils.currentStaffMemberGlobal = data
                // console.log('app component current user from db', data);
              }
            },
            (error: WedgeError) => {}
          )
      }
    })
  }

  private getInfo() {
    this.storage.get('info').subscribe((info: DropdownListInfo) => {
      if (info) {
        this.listInfo = info
        // console.log('app info in from storage....', info);
      } else {
        this.infoService
          .getDropdownListInfo()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((data) => {
            if (data) {
              this.listInfo = data
              // console.log('app info from db', data);
            }
          })
      }
    })
  }

  private setManifestName() {
    const baseUrl = environment.baseUrl
    const name = 'Edge 4'
    const isDev = baseUrl.includes('dev')
    const isTest = baseUrl.includes('test')
    switch (true) {
      case isDev:
        manifest.name = `${name} Dev`
        manifest.short_name = `${name} Dev`
        break
      case isTest:
        manifest.name = `${name} Test`
        manifest.short_name = `${name} Test`
        break
      default:
        manifest.name = `${name}`
        manifest.short_name = `${name}`
        break
    }
  }

  private setupEnvironmentVariables() {
    if (environment.production) {
      environment.baseUrl = this.configLoaderService.ApiEndpoint
      environment.endpointUrl = this.configLoaderService.ApiEndpoint
      environment.baseRedirectUri = this.configLoaderService.AppEndpoint
    }
  }

  toggleSideBar = false

  toggleSideNav() {
    this.toggleSideBar = !this.toggleSideBar
  }
}
