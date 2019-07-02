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
  isNavVisible: boolean;
  isScrollTopVisible = false;
  isFading = false;
  @ViewChild('appContainer') appContainer : ElementRef;
  appHeightObservable;
  get currentStaffMember(): StaffMember {
    return this.staffMemberService.currentStaffMember;
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
      this.isScrollTopVisible = false;
      this.isFading = true;
      setTimeout(()=>{
        this.isFading = false;
      }, 1200)
      window.scrollTo(0,0);
    });
  }

  ngOnInit() {
    this.appHeightObservable = new MutationObserver(()=>{
      this.toggleScrollTop();
    });
    this.appHeightObservable.observe(this.appContainer.nativeElement, {childList: true, subtree: true});
  }

  ngAfterViewChecked() {
    this.isNavVisible = this.authService.isLoggedIn();

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
