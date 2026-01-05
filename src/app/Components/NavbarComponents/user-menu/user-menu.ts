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

  timeoutId: any;
  clickListener: any;

  // IMPORTANT: Toggle menu on click
  toggleMenu(event: Event) {
    event.stopPropagation(); // Prevent this click from triggering the document listener immediately
    this.checkDirection();

    // Toggle state
    this.isOpen = !this.isOpen;

    // If opening, ensure (or re-ensure) the document listener is attached
    if (this.isOpen) {
      this.attachDocumentListener();
    } else {
      this.removeDocumentListener();
    }
  }

  // Handle closing strictly
  closeMenu() {
    this.isOpen = false;
    this.removeDocumentListener();
  }

  // Open logic not strictly needed for toggle, but good helper if needed
  openMenu() {
    // Legacy support if needed, or remove
    this.isOpen = true;
    this.attachDocumentListener();
  }

  // Attach a listener to the document to close menu if clicked outside
  attachDocumentListener() {
    if (!this.clickListener) {
      this.clickListener = this.onDocumentClick.bind(this);
      document.addEventListener('click', this.clickListener);
    }
  }

  removeDocumentListener() {
    if (this.clickListener) {
      document.removeEventListener('click', this.clickListener);
      this.clickListener = null;
    }
  }

  onDocumentClick(event: MouseEvent) {
    // If we click anywhere outside, close menu
    // (Note: The toggle click stops propagation, so it won't trigger this for the opening click)
    // We also need to make sure we don't close if clicking INSIDE the dropdown? 
    // Usually clicking items in the dropdown MIGHT close it (navigating), or might not.
    // The user requirement is "click again to disappear".
    // Standard UI behavior: Click outside closes it.

    const target = event.target as HTMLElement;
    const profileWrapper = document.querySelector('.profile-wrapper');
    const dropdown = document.querySelector('.dropdown');

    // If click is NOT inside profile wrapper
    if (profileWrapper && !profileWrapper.contains(target)) {
      this.isOpen = false;
      this.removeDocumentListener();
    }
  }

  ngOnDestroy() {
    this.removeDocumentListener();
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