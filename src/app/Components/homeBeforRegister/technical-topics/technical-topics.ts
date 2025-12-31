import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { MostPopular } from '../../most-popular/most-popular';
import { AdvancedCourses } from '../../advanced-courses/advanced-courses';
import { Subscription } from 'rxjs';
import { TopicService } from '../../../Services/topic-service';
import { TopicWithCourses } from '../../../Models/topic-with-courses';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { Rating } from 'primeng/rating';
import { Router, RouterLink } from '@angular/router';
import { PopoverModule } from 'primeng/popover';
import { ICourse } from '../../../Models/icourse';

@Component({
  selector: 'app-technical-topics',
  imports: [CommonModule, TabsModule,Carousel, ButtonModule, CardModule, FormsModule, Rating, RouterLink,PopoverModule],
  templateUrl: './technical-topics.html',
  styleUrl: './technical-topics.css',
})

export class TechnicalTopics implements OnInit, OnDestroy {
  responsiveOptions: any[] | undefined;

  courses!:TopicWithCourses[] ;
  dataResponse!: Subscription;
  cartAdded = false;
  wihshListAdded = false;
  value: number = 3;

  // Popover State
  hoveredCourse: any = null;
  popoverStyle: any = {};
  showPopover: boolean = false;
  private hideTimeout: any;

  cartItems: any[] = [];
  wishlistItems: any[] = [];
  cartLoaded = false;

  constructor(
    public topicService: TopicService,
    public cdn: ChangeDetectorRef,
    private router: Router
  ) { }

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


  ngOnInit() {
    this.dataResponse = this.topicService.getTopicsWithCourses().subscribe((data: any) => {
      this.courses = data.data;
      this.cdn.detectChanges();
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

  }


  trackByTopicId(index:number, topic:any)
  {
    return topic.id;
  }
  ngOnDestroy(): void {
    if (this.dataResponse) {
      this.dataResponse.unsubscribe();
    }
  }
}
