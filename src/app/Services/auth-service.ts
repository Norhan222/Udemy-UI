import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../Models/login-request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<any> {
    //  return this.http.post(`${environment.apiUrl}/login`, data);
     return this.http.post(`https://localhost:7009/api/Account/login`, data);
  }
}
