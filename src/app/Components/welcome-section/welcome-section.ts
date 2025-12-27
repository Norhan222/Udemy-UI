import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth-service';
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from '../../Pipes/capitalize-pipe';

@Component({
  selector: 'app-welcome-section',
  imports: [CommonModule,CapitalizePipe],
  templateUrl: './welcome-section.html',
  styleUrl: './welcome-section.css',
})
export class WelcomeSection implements  OnInit {
  isLoggedIn$;
  // firstName:string=''
    firstName$;
     constructor(private auth:AuthService){
        this.isLoggedIn$=auth.isLoggedIn$
        this.firstName$=auth.firstName$
    
      }
      ngOnInit(): void {
        
    
    
      }
    
}
