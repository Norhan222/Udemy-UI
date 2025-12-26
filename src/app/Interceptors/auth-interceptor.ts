import { TokenApi } from './../Models/token-api';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../Services/auth-service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService=inject(AuthService);
  const token=authService.getToken();
  const router=inject(Router)
  if(token){
    req=req.clone({
      setHeaders:{Authorization:`Bearer ${token}`}
    })
  }

  return next(req).pipe(
    catchError((err:any)=>{
      if(err instanceof HttpErrorResponse){
        if(err.status===401){
         return HandleUnauthorizedError()
      }
    }
      // Log the error and rethrow the original HttpErrorResponse so callers can inspect status and body
      console.error('HTTP error intercepted', err);
      return throwError(()=>err);
    })
  );
  function HandleUnauthorizedError() {
  let tokenApiModel =new TokenApi();
   tokenApiModel.accessToken=authService.getToken()!;
   tokenApiModel.token=authService.getRefreshToken()!;
   return authService.renewToken(tokenApiModel)
   .pipe(
    switchMap((data:TokenApi)=>{
      authService.storeRefreshToken(data.token);
      authService.storeToken(data.accessToken);
      authService.setLoginState(true)
      req=req.clone({
        setHeaders:{Authorization:`Bearer ${data.accessToken}`
      }
      })
      return next(req);
    }),
    catchError((err)=>{
      return throwError(()=>{
       router.navigate(['login'])
      })
    })
   )
};
};
