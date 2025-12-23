import { Injectable } from '@angular/core';
import { ICourse } from '../Models/icourse';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { shareReplay, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CourseService {

  baseUrl = environment.apiUrl;
  private courseCache = new Map<number, Observable<ICourse>>();

  constructor(private http:HttpClient) {}

  getCourses():Observable<ICourse[]> {
    return this.http.get<ICourse[]>(`${this.baseUrl}/Course/GetAll`);
  }

  /**
   * Fetch a course by id with in-memory caching.
   * If forceRefresh is true, the cached value is ignored and a fresh request is made.
   */
  getCourseById(id: number, forceRefresh: boolean = false): Observable<ICourse> {
    if (!forceRefresh && this.courseCache.has(id)) {
      return this.courseCache.get(id)!;
    }

    const obs$ = this.http.get<ICourse>(`${this.baseUrl}/Course/Get/${id}`).pipe(
      // cache latest successful response
      shareReplay(1),
      catchError((err) => {
        // don't cache failed responses
        this.courseCache.delete(id);
        return throwError(() => err);
      })
    );

    this.courseCache.set(id, obs$);
    return obs$;
  }

  /** Clear cached course(s). If id is omitted clears entire cache. */
  clearCourseCache(id?: number) {
    if (typeof id === 'number') {
      this.courseCache.delete(id);
    } else {
      this.courseCache.clear();
    }
  }

}
