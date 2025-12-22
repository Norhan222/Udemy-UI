import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../Services/auth-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

private authService = inject(AuthService);
private router = inject(Router);
  isLoading: boolean=false;

LoginForm: FormGroup = new FormGroup({
  userType: new FormControl('student', Validators.required), // Default: student
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).+$')
  ]),
  firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
  lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
});

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
private Registerauth!:Subscription;

 
 
 onSubmit() {
  if (this.LoginForm.invalid) return;

  this.isLoading = true;

  const { userType, ...data } = this.LoginForm.value;

  let registerObs!: Observable<any>; // 👈 مهم نحدد النوع

  if (userType === 'student') {
    registerObs = this.authService.Registerstudent(data);
  } else if (userType === 'instructor') {
    registerObs = this.authService.Registerinstructor(data);
  } else {
    console.error("Invalid user type");
    this.isLoading = false;
    return;
  }

  this.Registerauth = registerObs.subscribe({
    next: (res) => {
      console.log("Register response:", res);
      this.router.navigate(['/Login']);
      this.isLoading = false;
    },
    error: (err) => {
      console.log("Register error:", err);
      this.isLoading = false;
    }
  });
}


   ngOnDestroy(): void {
   this.Registerauth?.unsubscribe();
  }
}
