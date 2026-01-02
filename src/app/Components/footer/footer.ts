import { Component } from '@angular/core';
import { LanguageService } from '../../Services/language.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, TranslateModule, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  constructor(public languageService: LanguageService) { }

  switchLang() {
    this.languageService.switchLanguage();
  }
}
