import { Component } from '@angular/core';
import { Navbar } from '../Components/NavbarComponents/navbar/navbar';
import { Footer } from '../Components/footer/footer';
import { RouterOutlet } from '@angular/router';
import { TopHeader } from '../Components/top-header/top-header';
@Component({
  selector: 'app-app-start-home',
  imports: [Navbar,Footer,RouterOutlet,TopHeader],
  templateUrl: './app-start-home.html',
  styleUrl: './app-start-home.css',
})
export class AppStartHome {

}
