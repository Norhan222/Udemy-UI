import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Category } from '../../Models/category';
import { CategoryService } from '../../Services/category-service';
import { AuthService } from '../../Services/auth-service';
import { SubCategory } from '../../Models/sub-category';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-top-header',
  imports: [CommonModule],
  templateUrl: './top-header.html',
  styleUrl: './top-header.css',
})
export class TopHeader implements OnInit {
  categories!: Category[]
  isLoggedIn$;
  // firstName:string=''
  firstName$;

  private activeSub!: Subscription;

  constructor(private categoryService: CategoryService, private auth: AuthService) {
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
    const navRect = target.parentElement!.getBoundingClientRect();

    this.arrowLeft = rect.left - navRect.left + rect.width / 2 + 'px';
  }

  clearActive() {
    if (this.activeSub) {
      this.activeSub.unsubscribe();
    }
    this.activeCategory = null;
  }

}
