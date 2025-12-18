import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Category } from '../Models/category';
import { Observable, of, tap } from 'rxjs';
import { SubCategory } from '../Models/sub-category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl = environment.apiUrl;
  subCategoryCache = new Map<number, SubCategory[]>();

  constructor(private http:HttpClient) {}

  getCategories():Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/Category`);
  }

  getSubCategories(categoryId:number):Observable<SubCategory[]>{
   const cached = this.subCategoryCache.get(categoryId);
  if (cached !== undefined) {
    return of(cached);
  }
    return this.http.get<SubCategory[]>(`${this.baseUrl}/SubCategory/${categoryId}`)
    .pipe(
        tap(data=>this.subCategoryCache.set(categoryId,data))
    );
  }
}
