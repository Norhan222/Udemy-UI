import { Injectable } from '@angular/core';
import { ICourse } from '../Models/icourse';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
// course-content.model.ts
export interface CourseContent {
  id: number;
  title: string;
  description: string;
  sections: Section[];
}

export interface Section {
  id: number;
  title: string;
  orderIndex: number;
  lectures: Lecture[];

  // UI ONLY
  collapsed?: boolean;
  completedLectures?: number;
  totalLectures?: number;
  totalDuration?: string;
}

export interface Lecture {
  id: number;
  title: string;
  videoUrl: string | null;
  duration: number;
  orderIndex: number;
  isFree: boolean;

  // UI ONLY
  completed?: boolean;
}


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
getAdvancedCourses(): Observable<ICourse[]> {
    return this.http.get<ICourse[]>(`${this.baseUrl}/Course/Advanced`);
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
    return this.http.put(`${this.baseUrl}/InstructorCourse/update/${courseId}`, formData);
  }
 
   getCourseContent(courseId: number): Observable<CourseContent> {
    return this.http.get<CourseContent>(`${this.baseUrl}/Course/${courseId}/Content`);
  }
}
