import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../Services/auth-service';
import { User } from '../../../Models/user';
import { IntiialsPipe } from '../../../Pipes/intiials-pipe';
import { CapitalizePipe } from '../../../Pipes/capitalize-pipe';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    CommonModule,
    IntiialsPipe,
    CapitalizePipe,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css',
})
export class UserMenu implements OnInit {

  user: User = new User();
  isInstructor = false;
  isOpen = false;

  private router = inject(Router);

  constructor(private auth: AuthService) {}

  ngOnInit(): void {

    /** ===============================
     *  Listen for name updates (REAL TIME)
     * =============================== */
    this.auth.firstName$.subscribe(name => {
      if (name) {
        const parts = name.split(' ');
        this.user.firstName = parts[0] || '';
        this.user.lastName = parts.slice(1).join(' ') || '';
      }
    });

    /** ===============================
     *  Listen for avatar updates
     * =============================== */
    this.auth.profileImage$.subscribe(url => {
      this.user.profileImageUrl = url;
    });

    /** ===============================
     *  Static data from token (email / role)
     * =============================== */
    const claims = this.auth.getUserClaims();
    if (claims) {
      this.user.email = claims.email;
      this.user.role = claims.role;
      this.isInstructor = claims.role === 'Instructor';
    }

    /** ===============================
     *  Initial profile fetch (first load)
     * =============================== */
    const profile$ = this.isInstructor
      ? this.auth.getInstructorProfile()
      : this.auth.getStudentProfile();

    profile$.subscribe({
      next: res => {
        this.user.firstName ||= res.firstName;
        this.user.lastName ||= res.lastName;

        if (res.profileImageUrl) {
          const fullUrl = this.fixImageUrl(res.profileImageUrl);
          this.auth.setProfileImage(fullUrl);
        }

        // update shared name once
        this.auth.firstName.next(`${this.user.firstName} ${this.user.lastName}`);
      }
    });
  }

  /** ===============================
   *  Helpers
   * =============================== */
  private fixImageUrl(url: string): string {
    const full =
      url.startsWith('http')
        ? url
        : `https://localhost:5001/${url}`;

    return `${full}?v=${Date.now()}`;
  }

  openMenu() {
    this.isOpen = true;
  }

  closeMenu() {
    this.isOpen = false;
  }

  navigateToProfile() {
    const path = this.isInstructor
      ? '/Instructor/Profile/Edit'
      : '/Profile/Edit';

    this.router.navigate([path]);
    this.isOpen = false;
  }

  navigateToInstructorDashboard() {
    this.router.navigate(['/dashboard/courses']);
    this.isOpen = false;
  }

  logout() {
    this.auth.Signout();
    this.router.navigate(['/HomeBeforSignIn']);
  }
}
