import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CustomTranslateLoader implements TranslateLoader {
    constructor(private http: HttpClient) { }

    getTranslation(lang: string): Observable<any> {
        // Files in public/i18n/ are served from /i18n/ in Angular v21+
        const path = `/i18n/${lang}.json`;
        return this.http.get(path).pipe(
            tap({
                next: () => console.log(`Successfully loaded translation for: ${lang}`),
                error: (error: any) => console.error(`Failed to load translation for: ${lang}`, error)
            }),
            catchError((error: any) => {
                console.error(`Error loading translation file: ${path}`, error);
                return of({}); // Return empty object to prevent app crash
            })
        );
    }
}
