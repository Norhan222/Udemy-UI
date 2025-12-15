import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './Components/navbar/navbar';
import { Header } from './Components/header/header';
import { StartYourCourses } from './Components/start-your-courses/start-your-courses';
import { RecommenedCourses } from './Components/recommened-courses/recommened-courses';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Navbar,Header,StartYourCourses,RecommenedCourses ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('UdemyUI');
}
