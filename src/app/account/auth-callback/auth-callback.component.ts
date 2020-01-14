import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';


@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService, private _zone: NgZone) { }

  ngOnInit() {
    this.authService.completeAuthentication();

    setTimeout(() => {
      this._zone.run(
        () => {
          // const prev = localStorage.getItem('prev');
          // const url = prev && prev !== '/' ? prev : '/';

          this.router.navigateByUrl('/')
        }
      );
    }, 200);
  }
}
