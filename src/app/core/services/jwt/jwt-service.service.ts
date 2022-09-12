import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class JwtServiceService {
  jwtToken: string = '';
  decodedToken: { [key: string]: string } = {};
  helper = new JwtHelperService();

  constructor() {}

  setToken(token: string) {
    if (token) this.jwtToken = token;
  }

  decodeToken() {
    if (this.jwtToken) {
      this.decodedToken = this.helper.decodeToken(this.jwtToken);
    }
  }

  getExpiryTime() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['expiration'] : null;
  }

  isTokenExpired() {
    const expiryTime: number = Number(this.getExpiryTime());
    if (expiryTime) {
      return 1000 * expiryTime - new Date().getTime() < 5000;
    } else {
      return false;
    }
  }
}
