import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { MostPopular } from '../most-popular/most-popular';
import { AdvancedCourses } from '../advanced-courses/advanced-courses';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-featured-courses',
  imports: [CommonModule, TabsModule, MostPopular, AdvancedCourses, TranslateModule],
  templateUrl: './featured-courses.html',
  styleUrl: './featured-courses.css',
})
export class FeaturedCourses {

}
