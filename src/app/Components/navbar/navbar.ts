import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../Services/category-service';
import { Category } from '../../Models/category';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatListModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit{
  categories!:Category[];

 constructor(private catService:CategoryService) {}
  ngOnInit(): void {
    // this.catService.getCategories().subscribe((data)=>{
    //   console.log(data);
    // });
  }
}


