import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * Firebase Auth REST API
   * https://firebase.google.com/docs/reference/rest/auth
   */

  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  signUp(email: string, password: string) {
    return this.http.post(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
    .pipe(
      catchError(
        (errorResponse: HttpErrorResponse) => {
          return this.handleError(errorResponse);
        }
      ),
      tap((responseData: any) => {
        this.handleAuthentication(
          responseData.email,
          responseData.localId,
          responseData.idToken, 
          +responseData.expiresIn
        )
      })
    );
  }

  login(email: string, password: string) {
    return this.http.post(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
    .pipe(
      catchError(
        (errorResponse: HttpErrorResponse) => {
        return this.handleError(errorResponse);
      }),
      tap((responseData: any) => {
        this.handleAuthentication(
          responseData.email,
          responseData.localId,
          responseData.idToken, 
          +responseData.expiresIn
        )
      })
    );
  }

  /**
   * Auto login if we have a valid token
   * case we reload the App
   */
  autoLogin() {
    // Get the userData and covert it to Object
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    // If we have a valid token => autoLogin
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    // Set user to null
    this.user.next(null);
    this.router.navigate(['/auth']);
    // Remove token for localStorage
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  // Register authenticated user
  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const authenticatedUser = new User(email, userId, token, expirationDate);
    this.user.next(authenticatedUser);
    // Auto logout after expiresIn (convert it to milliseconds) 
    this.autoLogout(expiresIn * 1000);
    // Save user to LocalStorage
    localStorage.setItem('userData', JSON.stringify(authenticatedUser));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured';

    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
    }

    switch(errorResponse.error.error.message) {
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'There is no user record corresponding to this email.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password is invalid.';
        break;
      case 'USER_DISABLED':
        errorMessage = 'The user account has been disabled by an administrator.';
        break;
      case 'EMAIL_EXISTS': 
        errorMessage = 'The email address is already in use by another account.';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
        break;
    }

    return throwError(errorMessage);
  }
}
