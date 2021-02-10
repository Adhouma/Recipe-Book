import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  /**
   * Add token to all requests
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      /**
       * take(1) operator just takes the first value and completes, No further logic is involved
       * the unsubscribe()  is automatically done
       */
      take(1),
      /**
       * exhaustMap() operator waits for the previous observable to complete, then return a new observable which
       * will then replace the previous observable
       * => in nutshell merge two observable
       */
      exhaustMap((user: User) => {
        if (!user) {
          /**
           * If we dont have a user handle the request without token 
           * case login/signup
           */
          return next.handle(req);
        }
        /**
         * If we have a user then we have a token => handle the request with token as params
         */
        const modifiedRequest = req.clone({
          params: new HttpParams().set('auth', user.token)
        });
        return next.handle(modifiedRequest);
      })
    );
  }
}
