import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Topic } from '../../Models/topic';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { Rating } from 'primeng/rating';
import { ICourse } from '../../Models/icourse';
import { Subscription } from 'rxjs';
import { CourseService } from '../../Services/course-service';
import { Router, RouterLink } from '@angular/router';
import { CardDialog } from '../card-dialog/card-dialog';
import { CourseShowDialog } from '../../Directives/course-show-dialog';
import { CommonModule } from '@angular/common';
import { OverlayModule } from 'primeng/overlay';
import { CartService } from '../../Services/cart-service';
import { WishlistService } from '../../Services/wishlist';
import { Popover, PopoverModule } from 'primeng/popover';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-most-popular',
  imports: [Carousel, ButtonModule, CardModule, FormsModule, Rating, RouterLink, PopoverModule, CommonModule, TranslateModule],
  templateUrl: './most-popular.html',
  styleUrl: './most-popular.css',
})
export class MostPopular implements OnInit, OnDestroy {
  responsiveOptions: any[] | undefined;

  courses!: ICourse[];
  topPickCourse!: ICourse;
  dataResponse!: Subscription;
  cartAdded = false;
  wihshListAdded = false;
  value: number = 3;
  isLoading = true; // Add loading state

  // Custom Popover State
  hoveredCourse: any = null;
  popoverStyle: any = {};
  showPopover: boolean = false;
  private hideTimeout: any;

  private cartService = inject(CartService);
  private wihshList = inject(WishlistService);

  cartItems: any[] = [];
  wishlistItems: any[] = [];
  cartLoaded = false;

  constructor(
    public courseService: CourseService,
    public cdn: ChangeDetectorRef,
    private router: Router
  ) { }

  // Popover Methods
  showPopoverDetails(event: MouseEvent, course: any) {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    this.hoveredCourse = course;
    this.showPopover = true;
    this.calculatePopoverPosition(event.currentTarget as HTMLElement);
  }

  hidePopoverDetails() {
    this.hideTimeout = setTimeout(() => {
      this.showPopover = false;
      this.hoveredCourse = null;
      this.cdn.detectChanges();
    }, 200);
  }

  onPopoverMouseEnter() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  onPopoverMouseLeave() {
    this.hidePopoverDetails();
  }

  calculatePopoverPosition(target: HTMLElement) {
    const rect = target.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const popoverWidth = 360; // Match CSS
    const spacing = 15;

    let left = rect.right + spacing;
    let top = rect.top + scrollTop - 20;

    let arrowPosition = 'left';

    if (rect.right + popoverWidth + spacing > window.innerWidth) {
      left = rect.left - popoverWidth - spacing;
      arrowPosition = 'right';
    }

    if (left < 0) {
      left = rect.right + spacing;
      arrowPosition = 'left';
    }

    this.popoverStyle = {
      top: `${top}px`,
      left: `${left}px`,
      arrowPosition: arrowPosition,
      display: 'block'
    };
  }


  ngOnInit() {
    this.isLoading = true;
    this.dataResponse = this.courseService.getPopularCourses().subscribe({
      next: (data: any) => {
        this.courses = data.data;
        if (this.courses && this.courses.length > 0) {
          this.topPickCourse = this.courses[0];
        }
        this.isLoading = false;
        this.cdn.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching popular courses:', err);
        this.isLoading = false;
      }
    });

    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1,
      }
    ];

    // Load Cart
    this.cartService.getCart().subscribe({
      next: (res: any) => {
        if (res.data && res.data.items) {
          this.cartItems = res.data.items;
        }
        this.cartLoaded = true;
        this.cdn.detectChanges();
      },
      error: (er) => {
        this.cartLoaded = true;
        console.error('Error fetching cart items:', er);
      }
    });

    // Load Wishlist
    this.wihshList.getWishlist().subscribe({
      next: (res: any) => {
        if (res.data) {
          this.wishlistItems = res.data;
        }
        this.wihshListAdded = true;
        this.cdn.detectChanges();
      },
      error: (er) => {
        console.error('Error fetching wishlist items:', er);
      }
    });
  }

  isInCart(courseId: number | null | undefined): boolean {
    if (!courseId || !this.cartItems?.length) return false;
    return this.cartItems.some(item => item.courseId === courseId);
  }

  isInWishlist(courseId: number | null | undefined): boolean {
    if (!courseId || !this.wishlistItems?.length) return false;
    return this.wishlistItems.some(item => item.courseId === courseId);
  }

  addToCart(id: any): void {
    if (this.isInCart(id)) {
      this.router.navigate(['/cart']);
      return;
    }

    this.cartService.addToCart(id).subscribe({
      next: (res) => {
        console.log('addCart', res);
        this.cartAdded = true;
        // Optimization: Immediately update local state or wait for refresh
        this.cartItems.push({ courseId: id, ...res.data });
        this.cdn.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  addToWishlist(id: any): void {
    this.wihshList.addToWishlist(id).subscribe({
      next: (res) => {
        console.log('addWishlist', res);
        this.wihshListAdded = true;
        this.wishlistItems.push({ courseId: id, ...res.data });
        this.cdn.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.dataResponse) {
      this.dataResponse.unsubscribe();
    }
  }
}
