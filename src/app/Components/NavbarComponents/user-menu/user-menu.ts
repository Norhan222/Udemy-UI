import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { AuthService } from '../../../Services/auth-service';
import { User } from '../../../Models/user';
import { IntiialsPipe } from '../../../Pipes/intiials-pipe';
import { CapitalizePipe } from '../../../Pipes/capitalize-pipe';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  imports: [CommonModule,IntiialsPipe,CapitalizePipe,RouterLink,RouterLinkActive],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css',
})
export class UserMenu implements OnInit {
  user:User;
  userInfo:any;
  isInstructor:boolean=false;
  private router = inject<Router>(Router);
  constructor(private auth :AuthService){
     this.user=new User()
     this.userInfo=this.auth.getUserClaims()
     if(this.userInfo){
       const nameParts = (this.userInfo.name || '').split(' ');
       this.user.firstName = nameParts[0] || '';
       this.user.lastName = nameParts[1] || '';
       this.user.email = this.userInfo.email || '';
       this.isInstructor = (String(this.userInfo.role || '').toLowerCase() === 'instructor');
     }
  }

  navigateToProfile(){
    const path = this.isInstructor ? '/Instructor/Profile/Edit' : '/Profile/Edit';
    this.router.navigate([path]);
    this.isOpen = false;
  }
  ngOnInit(): void {
    // subscribe to shared profile image changes so the menu updates immediately after upload
    try {
      this.auth.profileImage$.subscribe((url) => {
        if (url) this.user.profileImageUrl = url; // includes cache-buster when set by editor
      });
    } catch {}

    // fetch profile to get avatar URL if available
    if (this.isInstructor) {
      this.auth.getInstructorProfile().subscribe({
        next: (res) => {
          const profileImageUrl = res.profileImageUrl ?? res.profileImage ?? res.profileImagePath ?? null;
          if (profileImageUrl) {
            // add an initial cache-buster to prevent stale images on first load
            const busted = `${profileImageUrl}${profileImageUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;
            this.user.profileImageUrl = busted;
            try { this.auth.setProfileImage(busted); } catch {}
          }
          // update names if backend has fresher values
          this.user.firstName = this.user.firstName || (res.firstName ?? res.FirstName ?? this.user.firstName);
          this.user.lastName = this.user.lastName || (res.lastName ?? res.LastName ?? this.user.lastName);
        },
        error: () => {
          // ignore errors — menu should still show initials
        }
      })
    } else {
      this.auth.getStudentProfile().subscribe({
        next: (res) => {
          const profileImageUrl = (res.profileImageUrl) ?? (res.profileImage) ?? (res.profileImagePath) ?? (null);
          if (profileImageUrl) {
            const busted = `${profileImageUrl}${profileImageUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;
            this.user.profileImageUrl = busted;
            try { this.auth.setProfileImage(busted); } catch {}
          }
          this.user.firstName = this.user.firstName || (res.firstName ?? res.FirstName ?? this.user.firstName);
          this.user.lastName = this.user.lastName || (res.lastName ?? res.LastName ?? this.user.lastName);
        },
        error: () => {
          // ignore errors
        }
      })
    }

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
    this.router.navigate(['/HomeBeforSignIn']);
  
  }
navigateToInstructorDashboard(){
  this.router.navigate(['/dashboard/courses']);
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
