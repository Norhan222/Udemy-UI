import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {

  private baseUrl = `${environment.apiUrl}/Wishlist`;

  constructor(private http: HttpClient) {}

  // ✅ GET all wishlist items
  getWishlist(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // ✅ POST add course to wishlist
  addToWishlist(courseId: number): Observable<any> {
    return this.http.post(this.baseUrl, {
      courseId: courseId
    });
  }

  // ✅ DELETE remove course from wishlist
  removeFromWishlist(courseId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${courseId}`);
  }

  // ✅ GET check if course exists in wishlist
  checkCourse(courseId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/check/${courseId}`);
  }

  // ✅ GET wishlist count
  getWishlistCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }
}
