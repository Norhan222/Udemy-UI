import { Injectable } from '@angular/core';
import { ICourse } from '../Models/icourse';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {

   baseUrl = environment.apiUrl;
  constructor(private http:HttpClient) {}

  getCourses():Observable<ICourse[]> {
    return this.http.get<ICourse[]>(`${this.baseUrl}/Course/GetAll`);
  }

}
