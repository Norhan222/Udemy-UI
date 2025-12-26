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

@Component({
  selector: 'app-trending-courses',
  imports: [Carousel, ButtonModule,CardModule,FormsModule, Rating, RouterLink],
  templateUrl: './trending-courses.html',
  styleUrl: './trending-courses.css',
})
export class TrendingCourses implements OnInit, OnDestroy {
  responsiveOptions: any[] | undefined;

    courses!:ICourse [] ;
    dataResponse!: Subscription;
    cartAdded = false;
      value: number = 3;
      // selectedCourse: any;
      // @ViewChild('op') OP!:OverlayPanel;

      constructor(public courseService: CourseService , public cdn:ChangeDetectorRef) {}//private topicService: TopicService) {}
       private cartService = inject(CartService);
                cartItems: any[] = []; 
                cartLoaded = false;
      ngOnInit() {

        this.dataResponse = this.courseService.getPopularCourses().subscribe((data:any)=>{
              this.courses = data.data;
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


  ngOnDestroy(): void {
    this.dataResponse.unsubscribe(); //end request
  }


}
