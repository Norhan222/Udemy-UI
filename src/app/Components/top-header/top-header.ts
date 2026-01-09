import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Category } from '../../Models/category';
import { CategoryService } from '../../Services/category-service';
import { AuthService } from '../../Services/auth-service';
import { SubCategory } from '../../Models/sub-category';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-top-header',
  imports: [CommonModule, TranslateModule],
  templateUrl: './top-header.html',
  styleUrl: './top-header.css',
})
export class TopHeader implements OnInit {
  categories!: Category[]
  isLoggedIn$;
  // firstName:string=''
  firstName$;

  private activeSub!: Subscription;

  constructor(
    private categoryService: CategoryService,
    private auth: AuthService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.isLoggedIn$ = auth.isLoggedIn$
    this.firstName$ = auth.firstName$

  }
  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data
      console.log(this.categories);
    })


  }

  activeCategory: SubCategory[] | null = null;

  arrowLeft = '50%';

  setActive(cat: Category, event: MouseEvent) {
    if (this.activeSub) {
      this.activeSub.unsubscribe();
    }

    this.activeSub = this.categoryService.getSubCategories(cat.id).subscribe(data => {
      this.activeCategory = data
    })

    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const navRect = target.closest('.category-navbar')!.getBoundingClientRect();

    this.arrowLeft = rect.left - navRect.left + rect.width / 2 - 8 + 'px';
  }

  clearActive() {
    if (this.activeSub) {
      this.activeSub.unsubscribe();
    }
    this.activeCategory = null;
  }

  getName(item: any): string {
    const lang = this.translate.currentLang || this.translate.defaultLang || 'en';
    return lang === 'ar' ? (item.nameAR || item.nameEN) : (item.nameEN || item.nameAR);
  }

  onCategoryClick(categoryName: string) {
    this.router.navigate(['/search'], { queryParams: { search: categoryName } });
    this.clearActive(); // Close the menu after clicking
  }
}
