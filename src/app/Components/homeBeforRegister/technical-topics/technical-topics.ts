import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { MostPopular } from '../../most-popular/most-popular';
import { AdvancedCourses } from '../../advanced-courses/advanced-courses';
import { Subscription } from 'rxjs';
import { TopicService } from '../../../Services/topic-service';
import { TopicWithCourses } from '../../../Models/topic-with-courses';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { RouterLink } from '@angular/router';

import { CartService } from '../../../Services/cart-service';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-technical-topics',
  imports: [CommonModule, TabsModule, CarouselModule, ButtonModule, CardModule, FormsModule, RatingModule, RouterLink, TranslateModule],
  templateUrl: './technical-topics.html',
  styleUrl: './technical-topics.css',
})

export class TechnicalTopics implements OnInit, OnDestroy {
  responsiveOptions: any[] | undefined;

  courses!: TopicWithCourses[];
  dataResponse!: Subscription;
  cartAdded = false;
  value: number = 3.7;
  // selectedCourse: any;
  // @ViewChild('op') OP!:OverlayPanel;

  // Popover State
  hoveredCourse: any = null;
  popoverStyle: any = {};
  showPopover: boolean = false;
  private hideTimeout: any;

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
      this.cdn.detectChanges(); // Ensure Angular updates the view
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


  constructor(public topicService: TopicService, public cdn: ChangeDetectorRef) { }//private topicService: TopicService) {}
  private cartService = inject(CartService);
  cartItems: any[] = [];
  cartLoaded = false;
  ngOnInit() {

    this.dataResponse = this.topicService.getTopicsWithCourses().subscribe((data: any) => {
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
      error: (er: any) => {
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
      next: (res: any) => {
        console.log('addCart', res);
        this.cartAdded = true;
        this.cartItems.push({ courseId: id, ...res.data });
        this.cdn.detectChanges(); // force update
      },
      error: (err: any) => {
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
