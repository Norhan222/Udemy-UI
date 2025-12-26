import { Component } from '@angular/core';
import { Header } from "../header/header";
import { StartYourCourses } from "../start-your-courses/start-your-courses";
import { RecommenedCourses } from "../recommened-courses/recommened-courses";
import { TrendingCourses } from "../trending-courses/trending-courses";
import { FeaturedCourses } from "../featured-courses/featured-courses";
import { TopicsRecommended } from "../topics-recommended/topics-recommended";
import { WelcomeSection } from '../welcome-section/welcome-section';

@Component({
  selector: 'app-home',
  imports: [Header, StartYourCourses, RecommenedCourses, TrendingCourses, FeaturedCourses, TopicsRecommended,WelcomeSection],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
