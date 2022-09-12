import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { LoginDto } from './dtos/login.dto';
import { ILoginResponse } from './../../core/interfaces/login-response.interface';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
  });
  hide = true;

  constructor(
    private _formBuilder: FormBuilder,
    private _matSnackBar: MatSnackBar,
    private _router: Router,
    private _authService: AuthService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  ngOnDestroy() {}

  createForm() {
    this.loginForm = this._formBuilder.group({
      username: [
        'jorgito test',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      password: [
        'jorgito123TEST',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      console.log(username, password);
      this._authService.loginUser(new LoginDto(username, password)).subscribe(
        (response: ILoginResponse) => {
          AuthService.setToken<string>(response.token);
          if (response.token) this._router.navigate(['/favorite']);
          else
            this._matSnackBar.open('Invalid credentials', 'Close', {
              duration: 3000,
            });
        },
        (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse);
          this._matSnackBar.open(
            `[${httpErrorResponse.status}] ${httpErrorResponse.message}`,
            'Close',
            {
              duration: 3000,
            }
          );
        }
      );
    } else {
      this._matSnackBar.open('Please fill in the form correctly', 'Close', {
        duration: 3000,
      });
    }
  }

  get getUserErrorMessages() {
    const errors: ValidationErrors =
      this.loginForm.controls['username'].errors || {};
    if (errors['required']) return 'Username is required';
    if (errors['minlength']) return 'Username must be at least 3 characters';
    if (errors['maxlength']) return 'Username must be at most 20 characters';
    return;
  }

  get getErrorMessage() {
    const errors: ValidationErrors =
      this.loginForm.controls['password'].errors || {};
    if (errors['required']) return 'Password is required';
    if (errors['minlength']) return 'Password must be at least 3 characters';
    if (errors['maxlength']) return 'Password must be at most 20 characters';
    return;
  }
}
