import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../Services/category-service';
import { Category } from '../../Models/category';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  categories!:Category[];
  constructor(private categoryService:CategoryService){}
  ngOnInit(): void {
   this.categoryService.getCategories().subscribe(data=>{
    this.categories=data
   })
  }
 tooltipVisible = false;

  tooltipItems = [
    { label: 'بيانات المستخدم', value: 'معلومات عن المستخدم الحالي' },
    { label: 'إحصائيات النظام', value: 'النظام يعمل بكفاءة 99%' },
    { label: 'إشعارات جديدة', value: 'لديك 3 إشعارات غير مقروءة' }
  ];

  selectedData = 'اختر نوع البيانات من القائمة';

  showTooltip() {
    this.tooltipVisible = true;
  }

  hideTooltip() {
    this.tooltipVisible = false;
  }

  selectItem(item: any) {
    this.selectedData = item.value;
    this.tooltipVisible = false;
  }
}
