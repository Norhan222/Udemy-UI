
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
activeSubMenu: string | null = null;

subMenus: any = {
  development: [
    { key: 'web', label: 'Web Development' },
    { key: 'mobile', label: 'Mobile Development' },
    { key: 'game', label: 'Game Development' }
  ],
  business: [
    { key: 'management', label: 'Management' },
    { key: 'sales', label: 'Sales' }
  ],
  it: [
    { key: 'security', label: 'Cyber Security' },
    { key: 'network', label: 'Networking' }
  ]
};

topics: any = {
  web: ['HTML', 'CSS', 'JavaScript', 'Angular', 'React'],
  mobile: ['Flutter', 'Android', 'iOS'],
  game: ['Unity', 'Unreal Engine'],
  management: ['Leadership', 'Agile'],
  sales: ['B2B Sales', 'Negotiation'],
  security: ['Ethical Hacking', 'Pen Testing'],
  network: ['CCNA', 'Routing & Switching']
};

openMenu() {
  this.isOpen = true;
}

closeMenu() {
  this.isOpen = false;
  this.activeMenu = null;
  this.activeSubMenu = null;
}

setActive(menu: string) {
  this.activeMenu = menu;
  this.activeSubMenu = null; // reset topics
}

setActiveSubMenu(sub: string) {
  this.activeSubMenu = sub;
}

}


