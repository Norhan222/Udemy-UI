import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './Components/navbar/navbar';
import { TopicsCarousel } from './Components/topics-carousel/topics-carousel';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Navbar,TopicsCarousel],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('UdemyUI');
}
