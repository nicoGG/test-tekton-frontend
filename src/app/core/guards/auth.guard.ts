import { AuthService } from './../services/auth/auth.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    console.log('AuthGuard#canActivate called', this.authService.getUserInfo());
    if (AuthService.getToken()) {
      return true;
    }
    // if (this.authService.getUserInfo()) {
    //   return true;
    // }
    this.router.navigate(['/auth/login']);
    return false;
  }
}
