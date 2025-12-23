import { Routes } from '@angular/router';
import { Login } from './Components/login/login';
import { Register } from './Components/register/register';
import { Notfound } from './Components/notfound/notfound';
import { Home } from './Components/home/home';
import { CourseDetailsComponent } from './Components/course-details/course-details';

export const routes: Routes = [
    {path:'', redirectTo: 'Home', pathMatch: 'full'},
    {path:'Home', component:Home,title:'Home'},
    {path:'Login', component:Login,title:'Login'},
    {path:'Register', component:Register,title:'Register'},
    {path:'course/:id', component: CourseDetailsComponent, title: 'Course Details'},
    {path:'**', component:Notfound,title:'Not Found Page'}
];
