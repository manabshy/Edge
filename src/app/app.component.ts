import { Component, Renderer2, ChangeDetectorRef, HostListener, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { AppUtils } from './core/shared/utils';
import { AuthService } from './core/services/auth.service';
import { SharedService } from './core/services/shared.service';
import { StaffMemberService } from './core/services/staff-member.service';
import { StaffMember } from './core/models/staff-member';
import { BehaviorSubject } from 'rxjs';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'Wedge';
  isScrollTopVisible = false;
  isFading = false;
  isCurrentUserAvailable = false;
  currentStaffMember: StaffMember;
  @ViewChild('appContainer') appContainer : ElementRef;
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  appHeightObservable;
  // get currentStaffMember(): StaffMember {
    //   return this.staffMemberService.currentStaffMember;
    // }

    get isLoggedIn(): boolean {
      return this.authService.isLoggedIn();
    }

    // get isLoadVisible(): boolean {
    //   return !(!!this.currentStaffMember);
    // }


  constructor(private router: Router,
    public authService: AuthService,
    protected sharedService: SharedService,
    protected staffMemberService: StaffMemberService,
    private renderer: Renderer2,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef) {
    /*  Track previous route for Breadcrumb component  */
    this.router.events.pipe(
      filter(e => e instanceof RoutesRecognized)
    ).pipe(
      pairwise()
    ).subscribe((event: any[]) => {
      AppUtils.prevRouteBU = AppUtils.prevRoute || '';
      AppUtils.prevRoute = event[0].urlAfterRedirects;

      if(AppUtils.prevRoute !== '/login' && !AppUtils.prevRoute.includes('/auth-callback')){
        localStorage.setItem('prev', AppUtils.prevRoute);
      }

      this.isScrollTopVisible = false;
      this.isFading = true;
      setTimeout(()=>{
        this.isFading = false;
      }, 1200)
      window.scrollTo(0,0);
    });
  }

  ngOnInit() {
    this.toastr.overlayContainer = this.toastContainer;
    if (this.isLoggedIn) {
      console.log('current user in app comp', this.currentStaffMember)
      console.log('is current user available flag 1', this.isCurrentUserAvailable);
      this.staffMemberService.getCurrentStaffMember().subscribe(data => {
     if(data) {
        this.currentStaffMember = data;
        this.isCurrentUserAvailable = true;
     }
        console.log('current user in app comp in ngOnInit', this.currentStaffMember);
        console.log('is current user available flag 2', this.isCurrentUserAvailable);
      });
    }
    this.appHeightObservable = new MutationObserver(()=>{
      this.toggleScrollTop();
    });
    this.appHeightObservable.observe(this.appContainer.nativeElement, {childList: true, subtree: true});
  }


  ngAfterViewChecked() {

    if (!this.isLoggedIn) {
      this.renderer.addClass(document.body, 'bg-dark');
    } else {
      this.renderer.removeClass(document.body, 'bg-dark');
    }

    this.cdRef.detectChanges();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    this.toggleScrollTop();
  }

  toggleScrollTop() {
    if (window.innerHeight < this.appContainer.nativeElement.scrollHeight) {
      this.isScrollTopVisible = true;
    } else {
      this.isScrollTopVisible = false;
    }
  }

  scrollTop() {
    window.scrollTo(0,0);
  }

}
