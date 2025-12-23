import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {  FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth-service';
import { Observable, Subscription } from 'rxjs';
import { routes } from '../../app.routes';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit{
 private authService = inject(AuthService);
 private router = inject(Router);
  isLoading: boolean=false;

 LoginForm:FormGroup=new FormGroup(
  {
    email:new FormControl('', [Validators.required, Validators.email] ),
    password:new FormControl('', [Validators.required, Validators.minLength(6) ,Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).+$')])
  }
 );
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
private Loginauth!:Subscription;


errorMessage: string = '';

 onSubmit() {
  if (this.LoginForm.invalid) return;

  this.isLoading = true;
  this.errorMessage! ;

  this.authService.Login(this.LoginForm.value).subscribe({
    next: (res) => {
      console.log("Login response:", res);
      this.isLoading = false;
      this.authService.storeToken(res.jwtToken);
      this.authService.storeRefreshToken(res.refreshToken);
      this.authService.setLoginState(true);

 onSubmit(){
  // console.log(this.LoginForm.value);
 this.authService.Login(this.LoginForm.value).subscribe({
    next:(res)=>{
      console.log("Login response:",res);
      this.isLoading=true;
      this.authService.storeToken(res.jwtToken)
      this.authService.storeRefreshToken(res.refreshToken)
      this.authService.setLoginState(true)
      this.authService.firstName.next(this.authService.getUserClaims()?.name.split(' ')[0])
      this.router.navigate(['/Home']);

    },
    error:(err)=>{
      console.log("Login error:",err);
      this.isLoading=false;
    }
  });
}



}
