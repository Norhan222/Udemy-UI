import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CategoryService } from '../../Services/category-service';
import { Category } from '../../Models/category';
import { SubCategory } from '../../Models/sub-category';
import { Topic } from '../../Models/topic';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-explore-menu',
  imports: [CommonModule],
  templateUrl: './explore-menu.html',
  styleUrl: './explore-menu.css',
})
export class ExploreMenu implements OnInit {
  isOpen = false;
  categories!: Category[];
  subCategories!: SubCategory[];
  topics!: Topic[] ;

  activeCategoryId: number | null = null;
  activeSubCategoryId: number | null = null;

  constructor(private catService:CategoryService  ,private cdr: ChangeDetectorRef){
   this.catService.getCategories().subscribe((data)=>{
      this.categories=data
    });
  }
  ngOnInit(): void {
    this.catService.getCategories().subscribe((data)=>{
      this.categories=data
    });
  }


openMenu() {
  this.isOpen = true;
}

closeMenu() {
  this.isOpen = false;

}

onCategoryHover(categoryId: number) {
if (this.activeCategoryId === categoryId) return;

    this.activeCategoryId = categoryId;
    this.activeSubCategoryId = null;
    this.topics = [];
    this.catService.getSubCategories(categoryId)
      .subscribe(data => {
        this.subCategories = data;
        this.cdr.detectChanges();
        console.log(this.subCategories)
      });
  }

  onSubCategoryHover(subId: number) {
    if (this.activeSubCategoryId === subId) return;

    this.activeSubCategoryId = subId;

    // this.catService.getSubCategories(subId)
    //   .subscribe((data) => {
    //     this.topics = data;
    //   });
  }
}
