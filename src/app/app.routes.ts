import { GuidelinePage } from './Components/Dashboard/guideline-page/guideline-page';
import { Reviews } from './Components/Dashboard/Performance/reviews/reviews';
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
import { MyLearning } from './Components/my-learning/my-learning';
import { HomeBeforSignIn } from './Components/homeBeforRegister/home-befor-sign-in/home-befor-sign-in';

import { componentDeactivateGuard } from './Guard/component-deactivate-guard';
import { Learn } from './Components/learn/learn';


export const routes: Routes = [
    // {path:'', redirectTo: 'Home', pathMatch: 'full'},
    // {path:'Home', component:Home,title:'Home'},
    // {path:'Login', component:Login,title:'Login'},
    // {path:'Register', component:Register,title:'Register'},
    // {path:'course/:id', component: CourseDetailsComponent, title: 'Course Details'},
    // {path:'**', component:Notfound,title:'Not Found Page'},
     
//befor login ///////////////////
{
  path: '',
  loadComponent: () =>
    import('./app-start-home/app-start-home')
      .then(m => m.AppStartHome),
  children: [
    { path: '', loadComponent: () => import('./Components/homeBeforRegister/home-befor-sign-in/home-befor-sign-in').then(m => m.HomeBeforSignIn) },
    {path:'', redirectTo: 'HomeBeforSignIn', pathMatch: 'full'},
    {path:'Login', component:Login,title:'Login'},
    {path:'Register', component:Register,title:'Register'},
  ]
},
///*********************************** */
    
    
    
    
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
    // Profile edit (student)
    { path: 'Profile/Edit', loadComponent: () => import('./Components/edit-student-profile/edit-student-profile').then(m => m.EditStudentProfile), title: 'Edit Profile' },
    // Instructor profile edit
    { path: 'Instructor/Profile/Edit', loadComponent: () => import('./Components/edit-instructor-profile/edit-instructor-profile').then(m => m.EditInstructorProfile), title: 'Edit Instructor Profile' },
    {path:'course/:id', component: CourseDetailsComponent, title: 'Course Details'},
    {path:'Cart', component: CartComponent, title: 'Cart'},
    {path:'logout', component: HomeBeforSignIn, title: 'Cart'},
    {path:'my-learning', component: MyLearning, title: 'My Learning'},
    {path:'learn/:id', component: Learn, title: 'learn'},
    {
    path:'HomeBeforSignIn',
       loadComponent: () => import('./Components/homeBeforRegister/home-befor-sign-in/home-befor-sign-in')
     .then(m=>m.HomeBeforSignIn)
  }

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
          {
            path: 'reviews',
            loadComponent: () =>
              import('./Components/Dashboard/Performance/reviews/reviews')
                .then(m => m.Reviews)
          },
           {
            path: 'students',
            loadComponent: () =>
              import('./Components/Dashboard/Performance/students/students')
                .then(m => m.Students)
          }
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

  },
   {path:'complete-creation-course',
     loadComponent: () => import('./Components/Dashboard/CourseCreation/complete-creation-course/complete-creation-course')
     .then(m => m.CompleteCreationCourse)
    },
     {path:'complete-creation-course/:id',
     loadComponent: () => import('./Components/Dashboard/CourseCreation/complete-creation-course/complete-creation-course')
     .then(m => m.CompleteCreationCourse),
     canDeactivate:[componentDeactivateGuard]
    },
  {
    path:'messageDetails',
     loadComponent: () => import('./Components/Dashboard/guideline-page/guideline-page')
     .then(m=>m.GuidelinePage)
  },

  
];
