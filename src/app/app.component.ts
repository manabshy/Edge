import { Component, Renderer2, ChangeDetectorRef, HostListener, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { Router, RoutesRecognized, ActivatedRoute } from '@angular/router';
import { filter, pairwise, takeUntil } from 'rxjs/operators';
import { AppUtils } from './core/shared/utils';
import { AuthService } from './core/services/auth.service';
import { SharedService, WedgeError } from './core/services/shared.service';
import { StaffMemberService } from './core/services/staff-member.service';
import { StaffMember } from './core/models/staff-member';
import { BehaviorSubject } from 'rxjs';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { EdgeServiceWorkerService } from './core/services/edge-service-worker.service';
import { BaseComponent } from './core/models/base-component';
import { InfoService } from './core/services/info.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent implements OnInit, AfterViewChecked {
  title = 'Wedge';
  isScrollTopVisible = false;
  isFading = false;
  isCurrentUserAvailable = false;
  currentStaffMember: StaffMember;
  @ViewChild('appContainer', { static: true }) appContainer : ElementRef;
  @ViewChild(ToastContainerDirective, { static: true }) toastContainer: ToastContainerDirective;
  appHeightObservable;
  navPlaceholder: string;
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
      pairwise()
    ).subscribe((event: any[]) => {
      AppUtils.prevRouteBU = AppUtils.prevRoute || '';
      AppUtils.prevRoute = event[0].urlAfterRedirects;
     
      console.log('prev url',  AppUtils.prevRoute);
      this.isScrollTopVisible = false;
      this.isFading = true;
      setTimeout(()=>{
        this.isFading = false;
      }, 1200)
      //window.scrollTo(0,0);
    });
  }

  ngOnInit() {
    this.toastr.overlayContainer = this.toastContainer;
    if (this.isLoggedIn) {
      this.staffMemberService.getCurrentStaffMember().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
        if (data) {
          this.currentStaffMember = data;
          this.isCurrentUserAvailable = true;
          this.staffMemberService.currentStaffMemberChange(data);
          console.log('app component current user', data);
        }
      }, (error: WedgeError) => {
        this.sharedService.showError(error);
      });

      this.infoService.getDropdownListInfo().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
        this.infoService.infoChanged(data);
        console.log('app component list info', data);
      });
    }
    this.appHeightObservable = new MutationObserver(() => {
      this.toggleScrollTop();
    });
    this.appHeightObservable.observe(this.appContainer.nativeElement, { childList: true, subtree: true });


    this.route.queryParams.subscribe(params => {
      if(params['docTitle']) {
        this.sharedService.setTitle(params['docTitle']);
        this.navPlaceholder = params['docTitle'];
        this.navPlaceholder = this.navPlaceholder.substring(this.navPlaceholder.indexOf('|') + 1).trim();
      }
    })
  }


  ngAfterViewChecked() {

    if (!this.isLoggedIn) {
      this.renderer.addClass(document.body, 'bg-dark');
    } else {
      this.renderer.removeClass(document.body, 'bg-dark');
    }

    this.cdRef.detectChanges();
    this.edgeServiceWorker.forceUpdate();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    this.toggleScrollTop();
  }

  toggleScrollTop() {
    if (window.innerHeight < this.appContainer.nativeElement.scrollHeight && window.scrollY) {
      this.isScrollTopVisible = true;
    } else {
      this.isScrollTopVisible = false;
    }
  }

  scrollTop() {
    window.scrollTo(0,0);
  }

}
