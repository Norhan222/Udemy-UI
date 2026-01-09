import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
    baseUrl: string = environment.apiUrl;
   constructor(private http:HttpClient){}

   // Get all coupons for a course
getCourseCoupons(courseId: Number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/InstructorCoupon/getAll/${courseId}`);
}

// Create new coupon
createCourseCoupon(courseId: Number, couponData: any): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/InstructorCoupon/${courseId}`, couponData);
}

// Deactivate coupon
deactivateCourseCoupon(courseId: Number, couponId: number): Observable<any> {
  return this.http.put<any>(
    `${this.baseUrl}/InstructorCoupon/update/${courseId}/${couponId}`,
    {}
  );
}

// Delete coupon
deleteCourseCoupon(couponId: number): Observable<any> {
  return this.http.delete<any>(
    `${this.baseUrl}/InstructorCoupon/delete/${couponId}`
  );
}
}
