import { Component } from '@angular/core';
import { Overview } from '../overview/overview';
import { Reviews } from '../reviews/reviews';

@Component({
  selector: 'app-performance-layout',
  imports: [Overview,Reviews],
  templateUrl: './performance-layout.html',
  styleUrl: './performance-layout.css',
})
export class PerformanceLayout {

}
