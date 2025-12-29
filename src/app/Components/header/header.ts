import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../Services/category-service';
import { Category } from '../../Models/category';
import { SubCategory } from '../../Models/sub-category';
import { AuthService } from '../../Services/auth-service';
import { Observable } from 'rxjs';
import { CapitalizePipe } from '../../Pipes/capitalize-pipe';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  categories!:Category[]
  isLoggedIn$;
  firstName:string=''
  constructor(private categoryService:CategoryService,private auth:AuthService){
  this.isLoggedIn$=auth.isLoggedIn$
  }
  ngOnInit(): void {
   this.firstName= this.auth.getUserClaims()?.name.split(' ')[0]
    this.categoryService.getCategories().subscribe(data=>{
      this.categories=data
    })

  }

  activeCategory: SubCategory[] | null = null;

  arrowLeft = '50%';

setActive(cat: Category, event: MouseEvent) {
  this.categoryService.getSubCategories(cat.id).subscribe(data=>{
    this.activeCategory=data
  })

  const target = event.target as HTMLElement;
  const rect = target.getBoundingClientRect();
  const navRect = target.parentElement!.getBoundingClientRect();

  this.arrowLeft = rect.left - navRect.left + rect.width / 2 + 'px';
}

  clearActive() {
    this.activeCategory = null;
  }

}
