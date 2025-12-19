import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './Components/NavbarComponents/navbar/navbar';
import { Footer } from './Components/footer/footer';
import { Header } from './Components/header/header';
import { StartYourCourses } from './Components/start-your-courses/start-your-courses';
import { RecommenedCourses } from './Components/recommened-courses/recommened-courses';
import { TopicsRecommended } from './Components/topics-recommended/topics-recommended';
import { TrendingCourses } from './Components/trending-courses/trending-courses';
import { FeaturedCourses } from './Components/featured-courses/featured-courses';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Navbar,Header,StartYourCourses,RecommenedCourses,TopicsRecommended,TrendingCourses,FeaturedCourses,Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('UdemyUI');
}
