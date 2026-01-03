import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './Components/footer/footer';
import { Navbar } from './Components/NavbarComponents/navbar/navbar';
import { Header } from './Components/header/header';
import { TopHeader } from './Components/top-header/top-header';
import { NgxSpinnerComponent } from "ngx-spinner";
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from './Models/login-response';
import { environment } from '../environments/environment';
import { AuthService } from './Services/auth-service';
import { LanguageService } from './Services/language.service';
import { Chatbot } from './Components/chatbot/chatbot';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerComponent,Chatbot],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  constructor(private http: HttpClient, private authService: AuthService, private languageService: LanguageService) {
  }
  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.http.get<LoginResponse['user']>(`${environment.apiUrl}/Account/me`)
        // .subscribe(user => this.authService['userSubject']({
        .subscribe({
          next: user => this.authService.setUser(user),
          error: () => this.authService.logout()
        });
    }
  }
  protected readonly title = signal('Udemy');
}
