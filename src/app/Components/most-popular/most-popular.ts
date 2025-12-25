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

@Component({
  selector: 'app-most-popular',
  imports: [Carousel, ButtonModule,CardModule,FormsModule, Rating, RouterLink],
  templateUrl: './most-popular.html',
  styleUrl: './most-popular.css',
})
export class MostPopular implements OnInit, OnDestroy {
  responsiveOptions: any[] | undefined;

    courses!:ICourse [] ;
    dataResponse!: Subscription;

      value: number = 3;
      // selectedCourse: any;
      // @ViewChild('op') OP!:OverlayPanel;

      constructor(public courseService: CourseService , public cdn:ChangeDetectorRef) {}//private topicService: TopicService) {}

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