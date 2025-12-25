import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-recommened-courses',
  imports: [Carousel, ButtonModule,CardModule,CommonModule,FormsModule,OverlayModule, Rating, RouterLink,CardDialog ,CourseShowDialog ],
  templateUrl: './recommened-courses.html',
  styleUrl: './recommened-courses.css',
})
export class RecommenedCourses implements OnInit, OnDestroy {
  responsiveOptions: any[] | undefined;

    courses!:ICourse [] ;
    topPickCourse!: ICourse;
    dataResponse!: Subscription;

      value: number = 3;
      // selectedCourse: any;
      // @ViewChild('op') OP!:OverlayPanel;

      constructor(public courseService: CourseService , public cdn:ChangeDetectorRef) {}//private topicService: TopicService) {}

      ngOnInit() {

        this.dataResponse = this.courseService.getRecommendedCourses().subscribe((data:any)=>{
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

ngOnDestroy(): void {
    this.dataResponse.unsubscribe(); //end request
  }
}
