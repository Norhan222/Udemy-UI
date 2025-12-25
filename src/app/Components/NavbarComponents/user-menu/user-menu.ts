import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../Services/auth-service';
import { User } from '../../../Models/user';
import { IntiialsPipe } from '../../../Pipes/intiials-pipe';
import { CapitalizePipe } from '../../../Pipes/capitalize-pipe';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  imports: [CommonModule,IntiialsPipe,CapitalizePipe,RouterOutlet],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css',
})
export class UserMenu implements OnInit {
  user:User;
  userInfo:any;
  constructor(private auth :AuthService, private router: Router){
     this.user=new User()
     this.userInfo=this.auth.getUserClaims()
     this.user.firstName=this.userInfo.name.split(' ')[0]
     this.user.lastName=this.userInfo.name.split(' ')[1]
     this.user.email=this.userInfo.email
  }
  ngOnInit(): void {

  }

  isOpen = false;

  openMenu() {
    this.isOpen = true;
  }

  closeMenu() {
    this.isOpen = false;
  }

  logout() {
    this.auth.Signout();
    this.router.navigate(['/home']);
  }
navigateToInstructorDashboard():void{

 this.router.navigate(['/dashboard']);
}
  // يقفل لما أضغط في أي مكان بره
  // @HostListener('document:click', ['$event'])
  // onClickOutside(event: MouseEvent) {
  //   const target = event.target as HTMLElement;
  //   if (!target.closest('.profile-wrapper')) {
  //     this.isOpen = false;
  //   }
  // }
}
