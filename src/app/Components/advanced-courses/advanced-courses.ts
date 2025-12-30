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
import { RouterLink } from '@angular/router';
import { CardDialog } from '../card-dialog/card-dialog';
import { CourseShowDialog } from '../../Directives/course-show-dialog';
import { CommonModule } from '@angular/common';
import { OverlayModule } from 'primeng/overlay';
import { CartService } from '../../Services/cart-service';
import { WishlistService } from '../../Services/wishlist';
import { Popover, PopoverModule } from 'primeng/popover';
@Component({
  selector: 'app-advanced-courses',
  imports: [Carousel, ButtonModule,CardModule,FormsModule, Rating, RouterLink,PopoverModule,CommonModule],
  templateUrl: './advanced-courses.html',
  styleUrl: './advanced-courses.css',
})
export class AdvancedCourses implements OnInit, OnDestroy {
  responsiveOptions: any[] | undefined;

    courses!:ICourse [] ;
    topPickCourse!: ICourse;
    dataResponse!: Subscription;
    cartAdded = false;
    wihshListAdded =false;
    value: number = 3;
      // selectedCourse: any;
      // @ViewChild('op') OP!:OverlayPanel;
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

      constructor(public courseService: CourseService ,
        public cdn:ChangeDetectorRef) {}
         private cartService = inject(CartService);
        private wihshList =inject(WishlistService);
                       cartItems: any[] = [];
                        wishlistItems: any[] = [];
                       cartLoaded = false;

      ngOnInit() {

        this.dataResponse = this.courseService.AdvancedCourses().subscribe((data:any)=>{
              this.courses = data.data;
              this.topPickCourse = this.courses[0];
              this.cdn.detectChanges();
           })

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
       //add to cart

         this.cartService.getCart().subscribe({
             next: (res: any) => {
             this.cartItems = res.data.items;
             this.cartLoaded = true;

            console.log('CART ITEMS:', this.cartItems);
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
          console.log('WISHLIST ITEMS:', this.wishlistItems);
          this.cdn.detectChanges();
        },
        error: (er) => {
         console.error('Error fetching wishlist items:', er);
       }
      });




          //
 }

      // getSeverity(status: string) {
      //     switch (status) {
      //         case 'INSTOCK':
      //             return 'success';
      //         case 'LOWSTOCK':
      //             return 'warn';
      //         case 'OUTOFSTOCK':
      //             return 'danger';
      //     }
      // }





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
          console.log('addCart', res);
          this.cartAdded = true;
          this.cartItems.push({ courseId: id, ...res.data });
         this.cdn.detectChanges(); // force update
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
        this.cdn.detectChanges(); // force update
        },
        error: (err) => {
        console.error(err);
        }
        });
    }


  ngOnDestroy(): void {
    this.dataResponse.unsubscribe(); //end request
  }


}
