import { Component } from '@angular/core';
import { Overview } from '../overview/overview';
import { Reviews } from '../reviews/reviews';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-performance-layout',
  imports: [Overview,Reviews,RouterOutlet],
  templateUrl: './performance-layout.html',
  styleUrl: './performance-layout.css',
})
export class PerformanceLayout {

}
