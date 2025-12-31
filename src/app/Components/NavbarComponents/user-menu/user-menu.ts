import { LoginResponse } from './../../../Models/login-response';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../Services/auth-service';
import { User } from '../../../Models/user';
import { IntiialsPipe } from '../../../Pipes/intiials-pipe';
import { CapitalizePipe } from '../../../Pipes/capitalize-pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    CommonModule,
    IntiialsPipe,
    CapitalizePipe,
    RouterLink,
    RouterLinkActive,
    TranslateModule
  ],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css',
})
export class UserMenu implements OnInit {

  user: User = new User();
  isInstructor = false;
  userr!: LoginResponse['user'];
  isOpen = false;
  userData$;
  private router = inject(Router);

  isRtl = false;

  constructor(private auth: AuthService) {
    this.userData$ = auth.user$;
  }

  ngOnInit(): void {
    const claims = this.auth.getUserClaims();
    if (claims) {
      this.user.email = claims.email;
      this.user.role = claims.role;
      this.user.firstName = claims.name.split(' ')[0];
      this.user.lastName = claims.name.split(' ')[1];
    }
  }

  checkDirection() {
    this.isRtl = document.documentElement.dir === 'rtl';
  }

  openMenu() {
    this.checkDirection();
    this.isOpen = true;
  }

  closeMenu() {
    this.isOpen = false;
  }

  navigateToProfile() {
    const path = this.isInstructor
      ? '/Instructor/Profile/Edit'
      : '/Profile/Edit';
    this.router.navigateByUrl('/Profile/Edit');
    this.isOpen = false;
  }

  navigateToInstructorDashboard() {
    this.router.navigate(['/dashboard/courses']);
    this.isOpen = false;
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/HomeBeforSignIn');
  }
}
