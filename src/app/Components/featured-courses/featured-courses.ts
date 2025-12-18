import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { RecommenedCourses } from '../recommened-courses/recommened-courses';
import { MostPopular } from '../most-popular/most-popular';
import { AdvancedCourses } from '../advanced-courses/advanced-courses';

@Component({
  selector: 'app-featured-courses',
  imports: [CommonModule, TabsModule,RecommenedCourses,MostPopular ,AdvancedCourses],
  templateUrl: './featured-courses.html',
  styleUrl: './featured-courses.css',
})
export class FeaturedCourses {

}
