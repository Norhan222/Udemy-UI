import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICourse } from '../Models/icourse';
import { Student } from '../Models/student';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getInstructorStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/InstructorCourse/students`);
  }
}
