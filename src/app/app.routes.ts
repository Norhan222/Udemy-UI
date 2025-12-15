import { Routes } from '@angular/router';
import { Login } from './Components/login/login';

export const routes: Routes = [
    //  {path:'', redirectTo: 'parent', pathMatch: 'full'}
    {path:'Login', component:Login,title:'Login'}
    // ,{path:'**', component:,title:'Not Found Page'}
];
