import { TokenApi } from './../Models/token-api';
import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../Services/auth-service';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { Router } from '@angular/router';
let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);


export const authInterceptor: HttpInterceptorFn =  (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(authReq).pipe(
    catchError((error: any) => {
      if (error.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);
          return authService.renewToken().pipe(
            switchMap((tokenResponse: any) => {
              isRefreshing = false;
              const newToken = tokenResponse.jwtToken;
              console.log("tooooooooooooooooooooooooooooooooken",newToken)
              localStorage.setItem('token', newToken);
              refreshTokenSubject.next(newToken);
              const newAuthReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              return next(newAuthReq);
            }),
            catchError((err: any) => {
              isRefreshing = false;
              authService.logout();
              return throwError(() => err);
            })
          );
        } else {
          return refreshTokenSubject.pipe(
            filter(tokenValue => tokenValue != null),
            take(1),
            switchMap(tokenValue => {
              const newAuthReq = req.clone({
                setHeaders: { Authorization: `Bearer ${tokenValue}` }
              });
              return next(newAuthReq);
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};
