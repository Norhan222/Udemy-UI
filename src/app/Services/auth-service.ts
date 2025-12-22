import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../Models/login-request';
import { IRegisterRequest } from '../Models/iregister-request';
import { TokenApi } from '../Models/token-api';
import{JwtHelperService} from '@auth0/angular-jwt';
import { User } from '../Models/user';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl:string=environment.apiUrl
  private  isLoggedInSubject=new BehaviorSubject<boolean>(false)
  isLoggedIn$=this.isLoggedInSubject.asObservable();
  private userPayload:any;
private jwtHelper = new JwtHelperService();
  constructor(private http: HttpClient) {
    // this.userPayload=this.decodeToken()
    // console.log(this.userPayload.name)
    // this.getUserInfoFromToken()
  }

  Login(data: LoginRequest): Observable<any> {
     return this.http.post(`${this.baseUrl}/Account/login`, data);
  }
  Register(data: IRegisterRequest): Observable<any> {
     return this.http.post(`${this.baseUrl}/Account/register-student`, data);
  }



  storeToken(tokenValue:string){
      localStorage.setItem('token',tokenValue)
  }
  getToken():string|null{
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
    name: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
    email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
    role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
  };
}

}
