import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './Components/footer/footer';
import { Navbar } from './Components/NavbarComponents/navbar/navbar';
import { Header } from './Components/header/header';
import { TopHeader } from './Components/top-header/top-header';
import { NgxSpinnerComponent } from "ngx-spinner";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App  implements OnInit{

constructor(private http:HttpClient,private authService:AuthService){
}
  ngOnInit(): void {
     if (localStorage.getItem('token')) {
    this.http.get<LoginResponse['user']>(`${environment.apiUrl}/Account/me`)
      .subscribe(user => this.authService['userSubject'].next(user));
  }
  }
  protected readonly title = signal('UdemyUI');
}
