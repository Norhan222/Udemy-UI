import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../Models/login-request';
import { IRegisterRequest } from '../Models/iregister-request';
import { TokenApi } from '../Models/token-api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl:string=environment.apiUrl
  private  isLoggedInSubject=new BehaviorSubject<boolean>(false)
  isLoggedIn$=this.isLoggedInSubject.asObservable();
  constructor(private http: HttpClient) {}

  Login(data: LoginRequest): Observable<any> {
     return this.http.post(`${this.baseUrl}/Account/login`, data);
  }
  Register(data: IRegisterRequest): Observable<any> {
     return this.http.post(`${this.baseUrl}/Account/register-student`, data);
  }



  storeToken(tokenValue:string){
      localStorage.setItem('token',tokenValue)
  }
  getToken(){
   return localStorage.getItem('token')
  }
  storeRefreshToken(tokenValue:string){
      localStorage.setItem('refreshtoken',tokenValue)
  }
  getRefreshToken(){
   return localStorage.getItem('refreshtoken')
  }
  setLoginState(state:boolean){
    this.isLoggedInSubject.next(state)
  }
  isLoggedIn():boolean{
      return this.isLoggedInSubject.value
  }
   renewToken(tokenApi:TokenApi):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/Account/refresh-token`, tokenApi)
  }
}
