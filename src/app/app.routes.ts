import { Routes } from '@angular/router';
import { Login } from './Components/login/login';
import { Register } from './Components/register/register';
import { Notfound } from './Components/notfound/notfound';
import { StartYourCourses } from './Components/start-your-courses/start-your-courses';

export const routes: Routes = [
    {path:'', redirectTo: 'StartYourCourses', pathMatch: 'full'},
    {path:'StartYourCourses', component:StartYourCourses,title:'StartYourCourses'},
    {path:'Login', component:Login,title:'Login'},
    {path:'Register', component:Register,title:'Register'},
    {path:'**', component:Notfound,title:'Not Found Page'}
];
