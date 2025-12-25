import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Topic } from '../Models/topic';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  baseUrl = environment.apiUrl;
  constructor(private http:HttpClient) {}
  getTopics():Observable<Topic[]> {
      return this.http.get<Topic[]>(`${this.baseUrl}/Topic/GetAll`);
    }

  getRecommended():Observable<Topic[]> {
      return this.http.get<Topic[]>(`${this.baseUrl}/Topic/recommended`);
    }

}
