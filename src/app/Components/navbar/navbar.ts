
import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../Services/category-service';
import { Category } from '../../Models/category';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
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

 isOpen = false;
  activeMenu: string | null = null;

  subMenus: any = {
    ai: ['AI Fundamentals', 'ChatGPT', 'Machine Learning'],
    career: ['Web Developer', 'Data Analyst', 'UX Designer'],
    cert: ['AWS', 'Azure', 'Google Cloud'],
    dev: ['Web Development', 'Mobile Apps', 'Game Development'],
    business: ['Entrepreneurship', 'Management'],
    finance: ['Accounting', 'Investing'],
    it: ['Networking', 'Cyber Security']
  };

  openMenu() {
    this.isOpen = true;
  }

  closeMenu() {
    this.isOpen = false;
    this.activeMenu = null;
  }

  setActive(menu: string) {
    this.activeMenu = menu;
  }
}


