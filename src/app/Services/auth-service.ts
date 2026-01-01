import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../Models/login-request';
import { IRegisterRequest } from '../Models/iregister-request';
import { TokenApi } from '../Models/token-api';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginResponse } from '../Models/login-response';
import { User } from '../Models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  baseUrl: string = environment.apiUrl;

  private jwtHelper = new JwtHelperService();

  /* =========================
     AUTH STATE
  ========================== */
  private userSubject =new BehaviorSubject<LoginResponse["user"] |null>(null)
  user$=this.userSubject.asObservable();
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  // isLoggedIn$ = this.isLoggedInSubject.asObservable();

  isLoggedIn$ = this.user$.pipe(
    map(user=>!!user)
  )

  /* =========================
     SHARED USER DATA (NAME + IMAGE)
  ========================== */

  firstName = new BehaviorSubject<string>('');
firstName$ = this.firstName.asObservable();

profileImage = new BehaviorSubject<string>('');
profileImage$ = this.profileImage.asObservable();


  constructor(private http: HttpClient) {

  }

  /* =========================
     AUTH METHODS
  ========================== */

  Login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/Account/login`, data)
    .pipe(
      tap(res=>{
        localStorage.setItem('token', res.jwtToken)
        localStorage.setItem('refreshToken',res.refreshToken)
        this.userSubject.next(res.user)
      }
      )
    );
  }

  Registerstudent(data: IRegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/Account/register-student`, data);
  }

  Registerinstructor(data: IRegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/Account/register-instructor`, data);
  }

  Signout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshtoken');
    localStorage.removeItem('firstName');
    localStorage.removeItem('profileImage');

    this.isLoggedInSubject.next(false);
    this.firstName.next('');
    this.profileImage.next('');
  }

  setLoginState(state: boolean) {
    this.isLoggedInSubject.next(state);
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }
 setUser(user:any){
  this.userSubject.next(user)
 }
  /* =========================
     TOKEN HANDLING
  ========================== */

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  storeRefreshToken(tokenValue: string) {
    localStorage.setItem('refreshtoken', tokenValue);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('firstName');
    localStorage.removeItem('profileImage');

    this.isLoggedInSubject.next(false);
    this.firstName.next('');
    this.profileImage.next('');
    this.userSubject.next(null)
    this.http.post(`${this.baseUrl}/Account/logout`, {}, {withCredentials:true}).subscribe()
  }

  renewToken(token:string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/Account/refresh-token`, {
  Token: token
}).pipe(
      tap(res=>{
        localStorage.setItem('token', res.token)
        localStorage.setItem('refreshToken',res.refreshToken)
      })
    )
  }

  /* =========================
     USER DATA HELPERS
  ========================== */

  setFirstName(name: string) {
    localStorage.setItem('firstName', name);
    this.firstName.next(name);
  }
  setProfileImage(url: string | null) {
  if (url) {
    localStorage.setItem('profileImage', url);
    this.profileImage.next(url); // 🔥 REQUIRED
  } else {
    localStorage.removeItem('profileImage');
    this.profileImage.next('');
  }
}


  /* =========================
     JWT HELPERS
  ========================== */

  decodeToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return this.jwtHelper.decodeToken(token);
    } catch {
      return null;
    }
  }

  getUserClaims() {
    const decoded = this.decodeToken();
    if (!decoded) return null;

    return {
      id: decoded.sub,
      name:
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      email:
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      role:
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
    };
  }

  /* =========================
     update PROFILE
  ========================== */

 getProfile(): Observable<any> {
  return this.http.get(`${this.baseUrl}/Profile`);
}

updateProfile(formData: FormData): Observable<any> {
  return this.http.put(`${this.baseUrl}/Profile`, formData);
}

changePassword(data: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/Profile/change-password`, data);
}


  /* =========================

  ========================== */

  // Add this to your AuthService
// Add this method to your auth-service.ts file

// In your auth-service.ts file

}
