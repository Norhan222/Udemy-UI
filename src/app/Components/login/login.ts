import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth-service';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';


import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnDestroy {

  private authService = inject(AuthService);
  private router = inject(Router);
  private getTokenSub!: Subscription;
  isLoading: boolean = false;

  LoginForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).+$')])
    }
  );
  private Loginauth!: Subscription;

  private cd = inject(ChangeDetectorRef);
  errorMessage: string = '';


  onSubmit() {
    // console.log(this.LoginForm.value);
    this.isLoading = true;
    this.getTokenSub = this.authService.Login(this.LoginForm.value).subscribe({
      next: (res) => {

        // console.log("Login response:",res.role);
        this.isLoading = false;
        // this.authService.storeToken(res.jwtToken)
        // this.authService.storeRefreshToken(res.refreshToken)
        // this.authService.profileImage.next(res.profileImageUrl)
        this.authService.firstName.next(this.authService.getUserClaims()?.name.split(' ')[0])
        if (res.user.role === 'Admin') {
          window.open('https://localhost:7288/', '_blank');
        }
        if (res.user.role === 'Instructor') {
          this.router.navigate(['/dashboard/courses']);
        }
        if (res.user.role === 'Student') {
          this.router.navigate(['/Home']);
        }
      },
      error: (err) => {
        console.error("Login error:", err.error[0]);
        this.isLoading = false;
        this.errorMessage = err.error[0];
        this.cd.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.getTokenSub?.unsubscribe();
  }

}
