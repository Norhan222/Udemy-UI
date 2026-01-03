import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Topic } from '../Models/topic';
import { Observable, of, tap } from 'rxjs';
import { TopicWithCourses } from '../Models/topic-with-courses';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  baseUrl = environment.apiUrl;
    TopicsCache = new Map<number, Topic[]>();

  constructor(private http:HttpClient) {}
  getTopics():Observable<Topic[]> {
      return this.http.get<Topic[]>(`${this.baseUrl}/Topic/GetAll`);
    }

  getRecommended():Observable<Topic[]> {
      return this.http.get<Topic[]>(`${this.baseUrl}/Topic/recommended`);
    }

    getTopicsWithCourses():Observable<TopicWithCourses[]> {
      return this.http.get<TopicWithCourses[]>(`${this.baseUrl}/Topic/TopicsWithCourses`);
    }
    getTopicsBySubCategory(catId:number):Observable<Topic[]>{
      const cached = this.TopicsCache.get(catId);
        if (cached !== undefined) {
          return of(cached);
        }
          return this.http.get<[Topic]>(`${this.baseUrl}/Topic/SubCategory/${catId}`)
          .pipe(
              tap(data=>this.TopicsCache.set(catId,data))
          );
        }
    }


