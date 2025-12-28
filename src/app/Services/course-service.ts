import { Injectable } from '@angular/core';
import { ICourse } from '../Models/icourse';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  baseUrl = environment.apiUrl;

  // ✅ cache DATA not Observable
  private courseCache = new Map<Number, ICourse>();

  constructor(private http: HttpClient) {}

  getCourses(): Observable<ICourse[]> {
    return this.http.get<ICourse[]>(`${this.baseUrl}/Course/GetAll`);
  }


  getStudentCourses(): Observable<ICourse[]> {
    return this.http.get<ICourse[]>(`${this.baseUrl}/Course/MyCoursesdd`);
  }

  getRecommendedCourses(): Observable<ICourse[]> {
    return this.http.get<ICourse[]>(`${this.baseUrl}/Course/Recommended?take=10`);
  }


  getPopularCourses(): Observable<ICourse[]> {
    return this.http.get<ICourse[]>(`${this.baseUrl}/Course/Popular/1?take=10`);
  }



  getCourseById(id: Number, forceRefresh = false): Observable<ICourse> {
    if (!forceRefresh && this.courseCache.has(id)) {
      // ✅ emit inside Angular zone naturally
      return of(this.courseCache.get(id)!);
    }

    return this.http.get<ICourse>(`${this.baseUrl}/Course/Get/${id}`).pipe(
      tap(course => {
        this.courseCache.set(id, course);
      }),
      catchError(err => {
        this.courseCache.delete(id);
        return throwError(() => err);
      })
    );
  }
   getInstructorCourseById(id: Number, forceRefresh = false): Observable<ICourse> {
    if (!forceRefresh && this.courseCache.has(id)) {
      // ✅ emit inside Angular zone naturally
      return of(this.courseCache.get(id)!);
    }

    return this.http.get<ICourse>(`${this.baseUrl}/InstructorCourse/${id}`).pipe(
      tap(course => {
        this.courseCache.set(id, course);
      }),
      catchError(err => {
        this.courseCache.delete(id);
        return throwError(() => err);
      })
    );
  }

  clearCourseCache(id?: number) {
    if (typeof id === 'number') {
      this.courseCache.delete(id);
    } else {
      this.courseCache.clear();
    }
  }
  createCourse(course: FormData): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/Course/CreateCourse`, course);
  }
  getInstructorCourses(): Observable<ICourse[]> {
    return this.http.get<ICourse[]>(`${this.baseUrl}/Course/InstructorCourses`);
  }
  getMyCourses(): Observable<any> {
    return this.http.get<ICourse[]>(`${this.baseUrl}/Course/MyCoursesdd`);  
  }

    // lern component test
  getCourseByIdtest(id: number, forceRefresh = false): Observable<ICourse> {
  if (!forceRefresh && this.courseCache.has(id)) {
    return of(this.courseCache.get(id)!);
  }

  return this.http
    .get<ICourse>(`${this.baseUrl}/Course/GetById/${id}`)
    .pipe(
      tap(course => {
        this.courseCache.set(id, course);
      }),
      catchError(err => {
        this.courseCache.delete(id);
        return throwError(() => err);
      })
    );
}


 updateInstructorCourse(courseId: Number, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/courses/${courseId}`, formData);
  }
}
