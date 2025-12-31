
// ==========================================
// trending-courses.ts - TypeScript المعدل
// ==========================================

import { ChangeDetectorRef, Component, ElementRef, HostListener, inject, OnDestroy, OnInit, QueryList, ViewChildren, AfterViewInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CourseService } from '../../Services/course-service';
import { RouterLink } from '@angular/router';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { Rating } from 'primeng/rating';
import { ICourse } from '../../Models/icourse';
import { CartService } from '../../Services/cart-service';
import { WishlistService } from '../../Services/wishlist';
import { Tooltip } from 'primeng/tooltip';
import { Popover } from 'primeng/popover';
import { PopoverModule } from 'primeng/popover';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-trending-courses',
  imports: [Carousel, ButtonModule, CardModule, FormsModule, Rating, RouterLink, PopoverModule, ButtonModule, CommonModule, TranslateModule],
  templateUrl: './trending-courses.html',
  styleUrl: './trending-courses.css',
})
export class TrendingCourses implements OnInit, OnDestroy, AfterViewInit {
  responsiveOptions: any[] | undefined;
  courses!: ICourse[];
  dataResponse!: Subscription;
  wihshListAdded = false;
  cartAdded = false;
  value: number = 3;

  ///
  @ViewChild('op') op!: Popover;


  hoveredProduct: any = null;
  hideTimer: any;

  showPopover(event: MouseEvent, product: any, op: Popover) {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }

    this.hoveredProduct = product;

    setTimeout(() => {
      op.show(event);
    });
  }

  scheduleHide(op: Popover) {
    this.hideTimer = setTimeout(() => {
      op.hide();
      this.hoveredProduct = null;
    },);
  }

  cancelHide() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }


  private cartService = inject(CartService);
  private wihshList = inject(WishlistService);
  cartItems: any[] = [];
  wishlistItems: any[] = [];
  cartLoaded = false;

  //////


  constructor(public courseService: CourseService, public cdn: ChangeDetectorRef) { }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.dataResponse = this.courseService.getPopularCourses().subscribe((data: any) => {
      this.courses = data.data;
      this.cdn.detectChanges();
    });

    this.responsiveOptions = [
      { breakpoint: '1400px', numVisible: 2, numScroll: 1 },
      { breakpoint: '1199px', numVisible: 3, numScroll: 1 },
      { breakpoint: '767px', numVisible: 2, numScroll: 1 },
      { breakpoint: '575px', numVisible: 1, numScroll: 1 }
    ];

    this.cartService.getCart().subscribe({
      next: (res: any) => {
        this.cartItems = res.data.items;
        this.cartLoaded = true;
        this.cdn.detectChanges();
      },
      error: (er) => {
        this.cartLoaded = true;
        console.error('Error fetching cart items:', er);
      }
    });

    this.wihshList.getWishlist().subscribe({
      next: (res: any) => {
        this.wishlistItems = res.data;
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
    this.cartService.addToCart(id).subscribe({
      next: (res) => {
        this.cartAdded = true;
        this.cartItems.push({ courseId: id, ...res.data });
        this.cdn.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  addToWishlist(id: any): void {
    this.wihshList.addToWishlist(id).subscribe({
      next: (res) => {
        this.wihshListAdded = true;
        this.wishlistItems.push({ courseId: id, ...res.data });
        this.cdn.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  ngOnDestroy(): void {
    this.dataResponse.unsubscribe();
  }
}
