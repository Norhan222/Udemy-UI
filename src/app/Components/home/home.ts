import { ChangeDetectorRef, Component } from '@angular/core';
import { Header } from "../header/header";
import { StartYourCourses } from "../start-your-courses/start-your-courses";
import { RecommenedCourses } from "../recommened-courses/recommened-courses";
import { TrendingCourses } from "../trending-courses/trending-courses";
import { FeaturedCourses } from "../featured-courses/featured-courses";
import { TopicsRecommended } from "../topics-recommended/topics-recommended";
import { WelcomeSection } from '../welcome-section/welcome-section';
import { CourseService } from '../../Services/course-service';
import { ICourse } from '../../Models/icourse';
import { Subscription } from 'rxjs';

import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [Header, StartYourCourses, RecommenedCourses, TrendingCourses, FeaturedCourses, TopicsRecommended, WelcomeSection, TranslateModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  courses!: ICourse[];
  dataResponse!: Subscription;
  isEmpty = false;

  // selectedCourse: any;
  // @ViewChild('op') OP!:OverlayPanel;

  constructor(public courseService: CourseService, public cdn: ChangeDetectorRef) { }//private topicService: TopicService) {}

  ngOnInit() {

    this.dataResponse = this.courseService.getStudentCourses().subscribe((data: any) => {
      this.courses = data.data;
      this.cdn.detectChanges();

      if (this.courses.length === 0) {
        this.isEmpty = true;
      }
    })
  }

}
