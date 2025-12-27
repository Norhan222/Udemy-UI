import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { RecommenedCourses } from '../../recommened-courses/recommened-courses';
import { MostPopular } from '../../most-popular/most-popular';
import { AdvancedCourses } from '../../advanced-courses/advanced-courses';
import { Subscription } from 'rxjs';
import { TopicService } from '../../../Services/topic-service';
import { TopicWithCourses } from '../../../Models/topic-with-courses';
import { CartService } from '../../../Services/cart-service';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { Rating } from 'primeng/rating';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-technical-topics',
  imports: [CommonModule, TabsModule,Carousel, ButtonModule,CardModule,FormsModule, Rating, RouterLink],
  templateUrl: './technical-topics.html',
  styleUrl: './technical-topics.css',
})
export class TechnicalTopics implements OnInit, OnDestroy {
  responsiveOptions: any[] | undefined;

    courses!:TopicWithCourses[] ;
    dataResponse!: Subscription;
   cartAdded = false;
      value: number = 3;
      // selectedCourse: any;
      // @ViewChild('op') OP!:OverlayPanel;

      constructor(public topicService: TopicService , public cdn:ChangeDetectorRef) {}//private topicService: TopicService) {}
     private cartService = inject(CartService);
        cartItems: any[] = []; 
        cartLoaded = false;
      ngOnInit() {

        this.dataResponse = this.topicService.getTopicsWithCourses().subscribe((data:any)=>{
              this.courses = data.data;
              this.cdn.detectChanges();
              console.log('Topics with courses:', this.courses);
              
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

        trackByTopicId(index: number, topic: any) {
                    return topic.id;
                   }
        ratingValue = 4;
      
      }