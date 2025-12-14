import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../Services/category-service';
import { Category } from '../../Models/category';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit{
  categories!:Category[];
 constructor(private catService:CategoryService) {}
  ngOnInit(): void {
    this.catService.getCategories().subscribe((data)=>{
      console.log(data);
    });
  }

}
