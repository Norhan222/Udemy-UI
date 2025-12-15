import { Routes } from '@angular/router';
import { Login } from './Components/login/login';
import { Register } from './Components/register/register';

export const routes: Routes = [
    //  {path:'', redirectTo: 'parent', pathMatch: 'full'}
    {path:'Login', component:Login,title:'Login'},
    {path:'Register', component:Register,title:'Register'},
    // ,{path:'**', component:,title:'Not Found Page'}
];
