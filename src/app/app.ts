import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './Components/Dashboard/navbar/navbar';
import { Footer } from './Components/footer/footer';
import { Header } from './Components/header/header';
import { Sidebar } from './Components/Dashboard/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Navbar,Footer,Header,Sidebar,Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('UdemyUI');
}
