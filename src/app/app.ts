import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './Components/footer/footer';
import { Navbar } from './Components/NavbarComponents/navbar/navbar';
import { Header } from './Components/header/header';
import { TopHeader } from './Components/top-header/top-header';
import { HomeBeforSignIn } from './Components/homeBeforRegister/home-befor-sign-in/home-befor-sign-in';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Navbar,Footer,TopHeader,HomeBeforSignIn],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('UdemyUI');
}
