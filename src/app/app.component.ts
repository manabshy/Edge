import { Component, Renderer2, ChangeDetectorRef, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { Router, RoutesRecognized, ActivatedRoute } from '@angular/router';
import { filter, pairwise, takeUntil, tap } from 'rxjs/operators';
import { AppUtils } from './core/shared/utils';
import { AuthService } from './core/services/auth.service';
import { SharedService, WedgeError } from './core/services/shared.service';
import { StaffMemberService } from './core/services/staff-member.service';
import { StaffMember } from './shared/models/staff-member';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { EdgeServiceWorkerService } from './core/services/edge-service-worker.service';
import { BaseComponent } from './shared/models/base-component';
import { InfoService } from './core/services/info.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { environment } from 'src/environments/environment';
import manifest from 'src/manifest.json';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent implements OnInit, AfterViewChecked {
  title = 'Wedge';
  isFading = false;
  isCurrentUserAvailable = false;
  currentStaffMember: StaffMember;
  listInfo: any;
  @ViewChild('appContainer', { static: true }) appContainer: ElementRef;
  @ViewChild(ToastContainerDirective, { static: true }) toastContainer: ToastContainerDirective;
  //  get currentStaffMemberGetter(): StaffMember {
  //     return this.currentStaffMember;
  //   }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // get isLoadVisible(): boolean {
  //   return !(!!this.currentStaffMember);
  // }


  constructor(private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    protected sharedService: SharedService,
    private infoService: InfoService,
    private storage: StorageMap,
    protected staffMemberService: StaffMemberService,
    private edgeServiceWorker: EdgeServiceWorkerService,
    private renderer: Renderer2,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef) {
    super();
    /*  Track previous route for Breadcrumb component  */

    this.router.events.pipe(
      filter(e => e instanceof RoutesRecognized)
    ).pipe(
      pairwise(),
      tap(data => console.log('events here...', data))
    ).subscribe((event: any[] | RoutesRecognized[]) => {
      AppUtils.prevRouteBU = AppUtils.prevRoute || '';
      AppUtils.prevRoute = event[0].urlAfterRedirects;
      const current = event[1].urlAfterRedirects;
      // console.log('events before checking current...', event)
      // if (current.indexOf('login') > -1 && current.indexOf('auth-callback') > -1 && current !== '/') {
      //   console.log('before removal', event)
      //   event.pop();
      //   console.log('after removal', event.forEach((x:RoutesRecognized)=>x.url))
      // }
      this.isFading = true;
      setTimeout(() => {
        this.isFading = false;
      }, 1200);
      // window.scrollTo(0,0);
    });
    console.log('instance created');
  }

  ngOnInit() {
    // this.edgeServiceWorker.forceUpdate();
    console.log('edgeServiceWorker in ngonit', this.edgeServiceWorker);
    this.toastr.overlayContainer = this.toastContainer;
    console.log('instance initiliased');
    this.setManifestName();
    console.log('manifest here..', manifest)

    if (this.isLoggedIn) {
      this.getCurrentStaffMember();

      this.getInfo();
    }


    this.route.queryParams.subscribe(params => {
      if (params['docTitle']) {
        this.sharedService.setTitle(params['docTitle']);
        AppUtils.navPlaceholder = params['docTitle'];
        AppUtils.navPlaceholder = AppUtils.navPlaceholder.substring(AppUtils.navPlaceholder.indexOf('|') + 1).trim();
      }
    });
  }

  ngAfterViewChecked() {

    if (!this.isLoggedIn) {
      this.renderer.addClass(document.body, 'bg-dark');
    } else {
      this.renderer.removeClass(document.body, 'bg-dark');
    }

    this.cdRef.detectChanges();
    // this.edgeServiceWorker.forceUpdate();
  }

  private getCurrentStaffMember() {
    this.storage.get('currentUser').subscribe((staffMember: StaffMember) => {
      if (staffMember) {
        this.currentStaffMember = staffMember;
        console.log('current user from storage here....', staffMember);
      } else {
        this.staffMemberService.getCurrentStaffMember().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
          if (data) {
            this.currentStaffMember = data;
            this.isCurrentUserAvailable = true;
            AppUtils.currentStaffMemberGlobal = data;
            console.log('app component current user from db', data);
          }
        }, (error: WedgeError) => {
          this.sharedService.showError(error);
        });
      }
    });
  }

  private getInfo() {
    this.storage.get('info').subscribe(info => {
      if (info) {
        this.listInfo = info;
        console.log('app info in from storage....', info);
      } else {
        this.infoService.getDropdownListInfo().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
          if (data) {
            this.listInfo = data;
            console.log('new sub i napp component list info', data);
          }
        });
      }
    });

  }

  private setManifestName() {
    const baseUrl = environment.baseUrl;
    const name = 'Edge 4';
    const isDev = baseUrl.includes('dev');
    const isTest = baseUrl.includes('test');
    switch (true) {
      case isDev:
        manifest.name = `${name} Dev`;
        manifest.short_name = `${name} Dev`;
        break;
      case isTest:
        manifest.name = `${name} Test`;
        manifest.short_name = `${name} Test`;
        break;
      default:
        manifest.name = `${name}`;
        manifest.short_name = `${name}`;
        break;
    }
  }
}
