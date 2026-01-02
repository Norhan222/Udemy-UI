import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Carousel } from 'primeng/carousel';
import { Tag } from 'primeng/tag';
import { Topic } from '../../../Models/topic';
import { Subscription } from 'rxjs';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { Rating } from 'primeng/rating';
import { TopicService } from '../../../Services/topic-service';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-topics-carousel',
  imports: [Carousel, ButtonModule, CardModule, FormsModule, TranslateModule],
  templateUrl: './topics-carousel.html',
  styleUrl: './topics-carousel.css',
})
export class TopicsCarousel implements OnInit, OnDestroy {
  responsiveOptions: any[] | undefined;

  courses!: Topic[];
  dataResponse!: Subscription;

  value: number = 3;
  // selectedCourse: any;
  // @ViewChild('op') OP!:OverlayPanel;

  constructor(public topicService: TopicService, public cdn: ChangeDetectorRef) { }//private topicService: TopicService) {}

  ngOnInit() {

    this.dataResponse = this.topicService.getTopics().subscribe((data) => {
      this.courses = data;
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
