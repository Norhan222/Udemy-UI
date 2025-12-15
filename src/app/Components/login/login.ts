import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {  FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth-service';
import { Observable, Subscription } from 'rxjs';
import { routes } from '../../app.routes';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit,OnDestroy{
 private authService = inject(AuthService);
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

 
 
 onSubmit(){
  // console.log(this.LoginForm.value);
 this.Loginauth = this.authService.Login(this.LoginForm.value).subscribe({
    next:(res)=>{
      console.log("Login response:",res);
      this.isLoading=true;
       // حفظ التوكنات في LocalStorage
      // localStorage.setItem('jwtToken', res.jwtToken);
      // localStorage.setItem('refreshToken', res.refreshToken);
    },
    error:(err)=>{
      console.log("Login error:",err);
      this.isLoading=false;
    }
  });
 }

   ngOnDestroy(): void {
   this.Loginauth?.unsubscribe();
  }
}
