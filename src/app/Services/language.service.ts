import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    currentLang = signal<string>('en');

    constructor(private translate: TranslateService) {
        this.translate.addLangs(['en', 'ar']);
        this.translate.setDefaultLang('en'); // CRITICAL: Must be called to ensure fallback

        // Default to 'en' or saved language
        const savedLang = localStorage.getItem('lang') || 'en';
        this.setLanguage(savedLang);
    }

    setLanguage(lang: string) {
        this.translate.use(lang);
        this.currentLang.set(lang);
        localStorage.setItem('lang', lang);

        // Handle RTL/LTR
        if (lang === 'ar') {
            document.documentElement.dir = 'rtl';
            document.documentElement.lang = 'ar';
        } else {
            document.documentElement.dir = 'ltr';
            document.documentElement.lang = 'en';
        }
    }

    switchLanguage() {
        const newLang = this.currentLang() === 'en' ? 'ar' : 'en';
        this.setLanguage(newLang);
    }
}
