import { Overview } from './Components/Dashboard/Performance/overview/overview';
import { PerformanceLayout } from './Components/Dashboard/Performance/performance-layout/performance-layout';
import { InstructorCourses } from './Components/Dashboard/instructor-courses/instructor-courses';
import { AppLayout } from './app-layout/app-layout';
import { App } from './app';
import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { Login } from './Components/login/login';
import { Register } from './Components/register/register';
import { Notfound } from './Components/notfound/notfound';
import { Home } from './Components/home/home';
import { CourseDetailsComponent } from './Components/course-details/course-details';
import { DashboardLayout } from './Components/Dashboard/dashboard-layout/dashboard-layout';
import { CartComponent } from './Components/cart-component/cart-component';

export const routes: Routes = [
    // {path:'', redirectTo: 'Home', pathMatch: 'full'},
    // {path:'Home', component:Home,title:'Home'},
    // {path:'Login', component:Login,title:'Login'},
    // {path:'Register', component:Register,title:'Register'},
    // {path:'course/:id', component: CourseDetailsComponent, title: 'Course Details'},
    // {path:'**', component:Notfound,title:'Not Found Page'},
     {
    path: '',
    loadComponent: () =>
      import('./app-layout/app-layout')
        .then(m => m.AppLayout),
    children: [
      { path: '', loadComponent: () => import('./Components/home/home').then(m => m.Home) },
    {path:'', redirectTo: 'Home', pathMatch: 'full'},
    {path:'Home', component:Home,title:'Home'},
    {path:'Login', component:Login,title:'Login'},
    {path:'Register', component:Register,title:'Register'},
    {path:'course/:id', component: CourseDetailsComponent, title: 'Course Details'},
    {path:'Cart', component: CartComponent, title: 'Cart'},
    // {path:'**', component:Notfound,title:'Not Found Page'},
    ]
  },
   {
    path: 'dashboard',
    loadComponent: () =>
      import('./Components/Dashboard/dashboard-layout/dashboard-layout')
        .then(m => m.DashboardLayout),
    children: [
      { path: 'courses',loadComponent: () =>
          import('./Components/Dashboard/instructor-courses/instructor-courses')
            .then(m => m.InstructorCourses) },
      {
        path: 'performance',
        loadComponent: () =>
          import('./Components/Dashboard/Performance/performance-layout/performance-layout')
            .then(m => m.PerformanceLayout),
        children: [
          {
            path: 'overview',
            loadComponent: () =>
              import('./Components/Dashboard/Performance/overview/overview')
                .then(m => m.Overview)
          },
          // {
          //   path: 'students',
          //   loadComponent: () =>
          //     import('./Components/Dashboard/Performance/students/students.component')
          //       .then(m => m.StudentsComponent)
          // }
        ]
      },
      // {
      //   path: 'courses',
      //   loadComponent: () =>
      //     import('./instructor/pages/courses/courses.component')
      //       .then(m => m.CoursesComponent)
      // }
    ]
  },
  {path:'course-creation',
    loadComponent:() =>
     import('./Components/Dashboard/CourseCreation/course-creation-stepper/course-creation-stepper')
      .then(m => m.CourseCreationStepper)
  
  }
];
