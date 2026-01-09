import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
   private baseUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient) {}

  getCart(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

 
  addToCart(courseId: number): Observable<any> {
    return this.http.post(this.baseUrl, {
      courseId: courseId
    });
  }


  removeFromCart(courseId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${courseId}`);
  }

  checkIfInCart(courseId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/check/${courseId}`);
  }

  getCartCount(): Observable<any> {
    return this.http.get(`${this.baseUrl}/count`);
  }

 
  clearCart(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/clear`);
  }

  moveFromWishlist(courseId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/move-from-wishlist`, {
      courseId: courseId
    });
}
applyCoupon(couponCode: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply-coupon`, { couponCode });
}

}
