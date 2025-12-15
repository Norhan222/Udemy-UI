import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth-service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  isLoading = false;
  errorMsg = '';

loginForm = this.fb.nonNullable.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)]],
});

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (res) => {
        console.log('Login Success', res);

        // حفظ التوكن
        // localStorage.setItem('token', res.token);

        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Invalid email or password';
        this.isLoading = false;
      }
    });
  }
}
