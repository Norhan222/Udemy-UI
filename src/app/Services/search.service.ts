import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout, shareReplay } from 'rxjs/operators';
import { SearchRequestDto, SearchApiResponse, SearchResponseDto } from '../Models/search.models';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private apiUrl = 'https://udemyfpiti.runasp.net/api/Search/courses';
    private cache = new Map<string, Observable<SearchResponseDto>>();

    constructor(private http: HttpClient) { }

    /**
     * Search for courses with filters
     */
    searchCourses(request: SearchRequestDto): Observable<SearchResponseDto> {
        let params = new HttpParams();

        // Add parameters only if they exist
        if (request.search) {
            params = params.set('search', request.search);
        }
        if (request.language) {
            params = params.set('language', request.language);
        }
        if (request.level) {
            params = params.set('level', request.level);
        }
        if (request.isFree !== undefined && request.isFree !== null) {
            params = params.set('isFree', request.isFree.toString());
        }
        if (request.minRating !== undefined && request.minRating !== null) {
            params = params.set('minRating', request.minRating.toString());
        }
        if (request.page) {
            params = params.set('page', request.page.toString());
        }
        if (request.pageSize) {
            params = params.set('pageSize', request.pageSize.toString());
        }

        // Create cache key from params
        const cacheKey = params.toString();

        // Check cache first
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }

        // Make request with timeout
        const request$ = this.http.get<SearchApiResponse>(this.apiUrl, { params }).pipe(
            timeout(10000), // 10 second timeout
            map(response => response.data),
            shareReplay(1) // Cache the result
        );

        // Store in cache
        this.cache.set(cacheKey, request$);

        // Clear cache after 5 minutes
        setTimeout(() => this.cache.delete(cacheKey), 300000);

        return request$;
    }
}
