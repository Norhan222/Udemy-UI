
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../Services/category-service';
import { Category } from '../../../Models/category';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { SubCategory } from '../../../Models/sub-category';
import { Topic } from '../../../Models/topic';
import { ExploreMenu } from '../explore-menu/explore-menu';
import { AuthService } from '../../../Services/auth-service';
import { UserMenu } from '../user-menu/user-menu';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, ExploreMenu, UserMenu, FormsModule, TranslateModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isLoggdIn$;
  searchQuery: string = '';
  constructor(private auth: AuthService, private router: Router) {
    this.isLoggdIn$ = auth.isLoggedIn$
  }
  ngOnInit(): void {
    if (this.auth.getToken()) {
      this.auth.setLoginState(true)
      this.auth.firstName.next(this.auth.getUserClaims()?.name.split(' ')[0])
    }

  }
  goToCart() {
    if (this.isLoggdIn$) {
      this.router.navigate(['/Cart']);
    } else {
      this.router.navigate(['/Login']);
    }
  }

  onSearch(event: Event): void {
    event.preventDefault();
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { search: this.searchQuery }
      });
    }
  }

}
