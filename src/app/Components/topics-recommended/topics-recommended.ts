import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Topic } from '../../Models/topic';
import { ButtonModule } from 'primeng/button';
import { Carousel } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { TopicService } from '../../Services/topic-service';
import { Subscription } from 'rxjs';
import { Rating } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-topics-recommended',
  imports: [Carousel, ButtonModule,CardModule,FormsModule, Rating, RouterLink,CommonModule],
  templateUrl: './topics-recommended.html',
  styleUrl: './topics-recommended.css',
})
export class TopicsRecommended implements OnInit, OnDestroy {
    responsiveOptions: any[] | undefined;
    topics!:Topic [] ;
    dataResponse!: Subscription;
    topicGroups: string[][] = [];
  
      constructor(private topicService: TopicService, public cdn:ChangeDetectorRef) {}
  
      ngOnInit() {

          this.dataResponse = this.topicService.getTopics().subscribe((data)=>{
                        this.topics = data;
                        for (let i = 0; i < this.topics.length; i += 2) {
          this.topicGroups.push([
                this.topics[i].name,
                this.topics[i + 1]?.name
                
          ]);
      }
                     })
         
          
      }

      
      ngOnDestroy(): void {
          this.dataResponse.unsubscribe(); //end request
        }
       

}
