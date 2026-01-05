import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../Services/search.service';
import { SearchRequestDto, SearchResponseDto, CourseSearchItemDto, SearchFacetsDto } from '../../Models/search.models';
import { FilterSidebar } from './filter-sidebar/filter-sidebar';
import { CartService } from '../../Services/cart-service';
import { AuthService } from '../../Services/auth-service';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search-results',
  imports: [CommonModule, FilterSidebar, TranslateModule],
  templateUrl: './search-results.html',
  styleUrl: './search-results.css',
})
export class SearchResults implements OnInit {
  courses: CourseSearchItemDto[] = [];
  facets: SearchFacetsDto | null = null;
  totalCount: number = 0;
  isLoading: boolean = false;
  showFilterSidebar: boolean = true; // Start open on desktop (standard behavior)
  currentPage: number = 1;
  pageSize: number = 10;
  searchQuery: string = '';

  cartCourseIds: Set<number> = new Set<number>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Check screen size for initial filter state
    // On mobile/tablet (< 992px), start closed. On desktop, start open.
    this.checkScreenSize();

    // Load cart items first
    this.loadCart();

    // ... existing subscription ... 
    this.route.queryParams.subscribe(params => {
      // ...
      this.searchQuery = params['search'] || '';
      this.currentPage = params['page'] ? +params['page'] : 1;
      // ...

      const request: SearchRequestDto = {
        // ... match existing ...
        search: params['search'],
        language: params['language'],
        level: params['level'],
        isFree: params['isFree'] === 'true' ? true : params['isFree'] === 'false' ? false : undefined,
        minRating: params['minRating'] ? +params['minRating'] : undefined,
        page: this.currentPage,
        pageSize: this.pageSize
      };

      this.loadSearchResults(request);
    });
  }

  checkScreenSize() {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 992) {
        this.showFilterSidebar = false;
      } else {
        this.showFilterSidebar = true;
      }
    }
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (response: any) => {
        if (response && response.data && response.data.items) {
          const ids = response.data.items.map((item: any) => item.courseId);
          this.cartCourseIds = new Set(ids);
          this.cdr.detectChanges();
        }
      },
      error: (error) => console.error('Error loading cart:', error)
    });
  }

  isInCart(courseId: number): boolean {
    return this.cartCourseIds.has(courseId);
  }

  loadSearchResults(request: SearchRequestDto): void {
    this.isLoading = true;
    this.cdr.detectChanges(); // Trigger detection for loading state

    this.searchService.searchCourses(request).subscribe({
      next: (response: SearchResponseDto) => {
        this.courses = response.courses;
        this.facets = response.facets;
        this.totalCount = response.totalCount;
        this.isLoading = false;
        this.cdr.detectChanges(); // Trigger detection for data update
      },
      error: (error: any) => {
        console.error('Error loading search results:', error);
        this.isLoading = false;
        this.cdr.detectChanges(); // Trigger detection for error state
      }
    });
  }

  toggleFilterSidebar(): void {
    this.showFilterSidebar = !this.showFilterSidebar;
  }

  onFilterChange(filters: any): void {
    // Build query params, excluding null/undefined values
    const queryParams: any = {
      search: this.searchQuery,
      page: 1 // Reset to first page when filters change
    };

    // Only add non-null filter values
    if (filters.minRating !== null && filters.minRating !== undefined) {
      queryParams.minRating = filters.minRating;
    }
    if (filters.language !== null && filters.language !== undefined) {
      queryParams.language = filters.language;
    }
    if (filters.level !== null && filters.level !== undefined) {
      queryParams.level = filters.level;
    }
    if (filters.isFree !== null && filters.isFree !== undefined) {
      queryParams.isFree = filters.isFree;
    }

    // Update URL - this will trigger ngOnInit to reload data
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }

  navigateToCourse(courseId: number): void {
    this.router.navigate(['/course', courseId]);
  }

  addToCart(courseId: number): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/Login']);
      return;
    }

    if (this.isInCart(courseId)) {
      // Already in cart -> go to cart
      this.router.navigate(['/cart']);
      return;
    }

    this.cartService.addToCart(courseId).subscribe({
      next: () => {
        console.log('Course added to cart successfully');
        this.cartCourseIds.add(courseId); // Update local state immediately
        this.cdr.detectChanges();

        // Navigate to cart immediately as requested
        this.router.navigate(['/cart']);
      },
      error: (error: any) => {
        console.error('Error adding to cart:', error);

        // Handle specific error cases
        const errorMessage = error.error?.message || error.message || '';
        if (error.status === 400 || errorMessage.toLowerCase().includes('enrol') || errorMessage.toLowerCase().includes('purchased')) {
          alert('You are already enrolled in this course.');
        } else if (errorMessage.toLowerCase().includes('cart')) {
          alert('This course is already in your cart.');
          this.cartCourseIds.add(courseId); // Sync state just in case
          this.router.navigate(['/cart']);
        } else {
          alert('Failed to add course to cart. Please try again.');
        }
        this.cdr.detectChanges();
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page },
        queryParamsHandling: 'merge'
      });
    }
  }
}
