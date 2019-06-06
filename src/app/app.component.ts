import { Component, Renderer2, ChangeDetectorRef, HostListener, OnInit, AfterViewChecked } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { AppUtils } from './core/shared/utils';
import { AuthService } from './core/services/auth.service';
import { SharedService } from './core/services/shared.service';
import { StaffMemberService } from './core/services/staff-member.service';
import { StaffMember } from './core/models/staff-member';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'Wedge';
  isNavVisible: boolean;
  isScrollTopVisible = false;
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
      window.scrollTo(0,0);
    });
  }

  ngOnInit() {
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
    if (window.innerHeight < document.body.scrollHeight) {
      this.isScrollTopVisible = true;
    }
  }

  scrollTop() {
    window.scrollTo(0,0);
  }

}
