import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../Models/login-request';
import { IRegisterRequest } from '../Models/iregister-request';
import { TokenApi } from '../Models/token-api';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginResponse } from '../Models/login-response';

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

  firstName = new BehaviorSubject<string>('')
  firstName$ = this.firstName.asObservable();

  profileImage = new BehaviorSubject<string>('')
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
    return localStorage.getItem('refreshtoken');
  }
  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshtoken');
    localStorage.removeItem('firstName');
    localStorage.removeItem('profileImage');

    this.isLoggedInSubject.next(false);
    this.firstName.next('');
    this.profileImage.next('');
    this.userSubject.next(null)
    this.http.post(`${this.baseUrl}/Account/logout`, {}, {withCredentials:true}).subscribe()
  }

  renewToken(): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/Account/refresh-token`,
      {},{withCredentials:true}
    ).pipe(
      tap(res=>{
        localStorage.setItem('token', res.token)
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
    } else {
      localStorage.removeItem('profileImage');
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
     STUDENT PROFILE
  ========================== */

  getStudentProfile(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/student/profile`);
  }

  updateStudentProfile(formData: FormData): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/student/profile`,
      formData
    );
  }

  changeStudentPassword(data: any): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/student/profile/change-password`,
      data
    );
  }

  /* =========================
     INSTRUCTOR PROFILE// auth-service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl;
  private jwtHelper = new JwtHelperService();

  // ===== GLOBAL USER STATE =====
  fullName$ = new BehaviorSubject<string>('');
  profileImage$ = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {}

  // ===== AUTH =====
  Login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Account/login`, data);
  }

  Signout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshtoken');
    this.fullName$.next('');
    this.profileImage$.next('');
  }

  storeToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ===== JWT =====
  decodeToken(): any | null {
    const token = this.getToken();
    if (!token) return null;
    return this.jwtHelper.decodeToken(token);
  }

  getUserClaims() {
    const decoded = this.decodeToken();
    if (!decoded) return null;

    return {
      id: decoded.sub,
      name: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    };
  }

  // ===== PROFILE HELPERS =====
  setFullName(name: string) {
    this.fullName$.next(name);
  }

  setProfileImage(url: string) {
    this.profileImage$.next(url);
  }

  // ===== STUDENT =====
  getStudentProfile() {
    return this.http.get<any>(`${this.baseUrl}/student/profile`);
  }

  updateStudentProfile(formData: FormData) {
    return this.http.put<any>(`${this.baseUrl}/student/profile`, formData);
  }

  // ===== INSTRUCTOR =====
  getInstructorProfile() {
    return this.http.get<any>(`${this.baseUrl}/instructor/profile`);
  }

  updateInstructorProfile(formData: FormData) {
    return this.http.put<any>(`${this.baseUrl}/instructor/profile`, formData);
  }
}

  ========================== */

  getInstructorProfile(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/instructor/profile`);
  }

  updateInstructorProfile(formData: FormData): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/instructor/profile`,
      formData
    );
  }
}
