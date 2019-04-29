import { Component, Renderer2, ChangeDetectorRef, HostListener, OnInit, AfterViewChecked } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { AppUtils } from './core/shared/utils';
import { AuthService } from './core/services/auth.service';
import { SharedService } from './core/services/shared.service';
import { StaffMemberService } from './core/services/staff-member.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'Wedge';
  isNavVisible: boolean;
  isScrollTopVisible = false;

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
    });
  }

  ngOnInit() {
  this.sharedService.getDropdownListInfo().subscribe();
  this.staffMemberService.getCurrentStaffMember().subscribe();
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
    if (window.scrollY > window.innerHeight * 0.80) {
      this.isScrollTopVisible = true;
    } else {
      this.isScrollTopVisible = false;
    }
  }

  scrollTop() {
    document.getElementsByTagName('body')[0].scrollIntoView({behavior: 'smooth', block: 'start'});
  }

}
