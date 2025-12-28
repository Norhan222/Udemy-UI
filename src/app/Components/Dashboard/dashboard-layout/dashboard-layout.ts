import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { Navbar } from '../navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../footer/footer';
import { InstructorCourses } from '../instructor-courses/instructor-courses';
import { Overview } from '../Performance/overview/overview';
import { PerformanceLayout } from '../Performance/performance-layout/performance-layout';
import { InstructorNotification } from '../instructor-notification/instructor-notification';



@Component({
  selector: 'app-dashboard-layout',
  imports: [Sidebar,Navbar,RouterOutlet,Footer,InstructorCourses,Overview,PerformanceLayout,InstructorNotification],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {


}
