
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CategoryService } from '../../Services/category-service';
import { Category } from '../../Models/category';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { SubCategory } from '../../Models/sub-category';
import { Topic } from '../../Models/topic';
import { ExploreMenu } from '../explore-menu/explore-menu';
import { AuthService } from '../../Services/auth-service';


@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink,ExploreMenu],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit{
 isLoggdIn$;
 constructor(private auth:AuthService) {
  this.isLoggdIn$=auth.isLoggedIn$
 }
  ngOnInit(): void {
    if(this.auth.getRefreshToken()){
      this.auth.setLoginState(true)
    }
   
  }


}


