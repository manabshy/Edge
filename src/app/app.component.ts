import { Component, Renderer2, ChangeDetectorRef, HostListener } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { AppUtils } from './core/shared/utils';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Wedge';
  isNavVisible: boolean;
  isScrollTopVisible: boolean = false;

  constructor(private router: Router, public authService: AuthService, private renderer: Renderer2, private cdRef:ChangeDetectorRef) {
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
  }

  ngAfterViewChecked()
  {
    this.isNavVisible = this.authService.isLoggedIn();

    if(!this.isNavVisible) {
      this.renderer.addClass(document.body, 'bg-dark');
    } else {
      this.renderer.removeClass(document.body, 'bg-dark');
    }

    this.cdRef.detectChanges();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    if(window.scrollY > window.innerHeight * 0.25) {
      this.isScrollTopVisible = true;
    } else {
      this.isScrollTopVisible = false;
    }
  }

  scrollTop() {
    document.getElementsByTagName('body')[0].scrollIntoView({behavior: 'smooth', block: 'start'});
  }

}
