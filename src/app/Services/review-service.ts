import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Review } from '../Models/review';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  
  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/student/reviews/instructor-getAllReviews`);
  }
}
