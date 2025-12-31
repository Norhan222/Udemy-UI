import { Component } from '@angular/core';
import { Overview } from '../overview/overview';
import { Reviews } from '../reviews/reviews';
import { RouterModule, RouterOutlet } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-performance-layout',
  imports: [RouterOutlet, RouterModule, TranslateModule],
  templateUrl: './performance-layout.html',
  styleUrl: './performance-layout.css',
})
export class PerformanceLayout {

}
