import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth-service';
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from '../../Pipes/capitalize-pipe';
import { LoginResponse } from '../../Models/login-response';

@Component({
  selector: 'app-welcome-section',
  imports: [CommonModule,CapitalizePipe],
  templateUrl: './welcome-section.html',
  styleUrl: './welcome-section.css',
})
export class WelcomeSection implements  OnInit {
  isLoggedIn$;
  user$;
  user!:LoginResponse['user']
  ProfileImage:string|null=null
  // firstName:string=''
    firstName$;
     constructor(private auth:AuthService){
        this.isLoggedIn$=auth.isLoggedIn$
        this.firstName$=auth.firstName$
        this.user$=auth.user$
                }
      ngOnInit(): void {
        
    
    
      }
    
}
