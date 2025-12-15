import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../Models/login-request';
import { IRegisterRequest } from '../Models/iregister-request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  Login(data: LoginRequest): Observable<any> {
     return this.http.post(`${environment.apiUrl}/Account/login`, data);
  }
  Register(data: IRegisterRequest): Observable<any> {
     return this.http.post(`${environment.apiUrl}/Account/register`, data);
  }
}
