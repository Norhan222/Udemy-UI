import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
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

 LoginForm:FormGroup=new FormGroup(
  {
    email:new FormControl('', [Validators.required, Validators.email] ),
    password:new FormControl('', [Validators.required, Validators.minLength(6) ,
      Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).+$')]),
    firstName:new FormControl('', [Validators.required, Validators.minLength(3)] ),
    lastName:new FormControl('', [Validators.required, Validators.minLength(3)] ),
  }
 );
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
private Registerauth!:Subscription;

 
 
 onSubmit(){
  // console.log(this.LoginForm.value);
 this.Registerauth = this.authService.Register(this.LoginForm.value).subscribe({
    next:(res)=>{
      console.log("Register response:",res);
      this.isLoading=true;
       this.router.navigate(['/Login']);
    },
    error:(err)=>{
      console.log("Register error:",err);
      this.isLoading=false;
    }
  });
 }

   ngOnDestroy(): void {
   this.Registerauth?.unsubscribe();
  }
}
