import { Component } from '@angular/core';
import { UserMenu } from '../../NavbarComponents/user-menu/user-menu';

@Component({
  selector: 'app-navbar',
  imports: [UserMenu],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
 role = 'Student';
  navigateToHome(){
    window.location.href = '/';
  }

}
