import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { Navbar } from '../navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../footer/footer';

@Component({
  selector: 'app-dashboard-layout',
  imports: [Sidebar,Navbar,RouterOutlet,Footer],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {

}
