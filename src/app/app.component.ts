import { Component, Renderer2, ChangeDetectorRef, HostListener, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { AppUtils } from './core/shared/utils';
import { AuthService } from './core/services/auth.service';
import { SharedService } from './core/services/shared.service';
import { StaffMemberService } from './core/services/staff-member.service';
import { StaffMember } from './core/models/staff-member';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'Wedge';
  isScrollTopVisible = false;
  isFading = false;
  @ViewChild('appContainer') appContainer : ElementRef;
  appHeightObservable;
  get currentStaffMember(): StaffMember {
    return this.staffMemberService.currentStaffMember;
  }

  get isNavVisible(): boolean {
    return this.authService.isLoggedIn();
  }

  constructor(private router: Router,
    public authService: AuthService,
    protected sharedService: SharedService,
    protected staffMemberService: StaffMemberService,
    private renderer: Renderer2,
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
    if(this.isNavVisible) {
      this.staffMemberService.getCurrentStaffMember().subscribe();
    }
    this.appHeightObservable = new MutationObserver(()=>{
      this.toggleScrollTop();
    });
    this.appHeightObservable.observe(this.appContainer.nativeElement, {childList: true, subtree: true});
  }


  ngAfterViewChecked() {

    if (!this.isNavVisible) {
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
