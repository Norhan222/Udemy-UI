import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Category } from '../Models/category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl = environment.apiUrl;
  constructor(private http:HttpClient) {}

  getCategories():Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/Category`);
  }
}
