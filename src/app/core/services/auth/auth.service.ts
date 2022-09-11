import { environment } from './../../../../environments/environment';
import { LoginDto } from './../../../modules/auth/dtos/login.dto';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ILoginResponse } from '../../interfaces/login-response.interface';
import { IUser } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl: string = environment.apiUrl || 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  loginUser(loginDto: LoginDto): Observable<ILoginResponse> {
    return this.http
      .post<ILoginResponse>(`${this.apiUrl}/auth/login`, loginDto)
      .pipe(retry(3), catchError(this.handleError));
  }

  getUserInfo(): Observable<IUser> {
    return this.http
      .get<IUser>(`${this.apiUrl}/auth/profile`)
      .pipe(retry(3), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  saveIdUser(id: string) {
    localStorage.setItem('id', id);
  }

  getIdUser() {
    return localStorage.getItem('id');
  }

  static isLogged() {
    return !!localStorage.getItem('token');
  }

  static setToken<T = string>(token: T) {
    localStorage.setItem('token', token as any);
  }

  static getToken() {
    return localStorage.getItem('token');
  }

  static removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
  }
}
