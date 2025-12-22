import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './Components/NavbarComponents/navbar/navbar';
import { Footer } from './Components/footer/footer';
import { Header } from './Components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Navbar,Footer,Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('UdemyUI');
}
