import { ChangeDetectorRef, Component } from '@angular/core';
import { StepperService } from '../../../../../Services/stepper-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { CategoryService } from '../../../../../Services/category-service';
import { Category } from '../../../../../Models/category';

@Component({
  selector: 'app-step3',
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './step3.html',
  styleUrl: './step3.css',
})
export class Step3 {
  category = 0;

  // categories = [
  //   { value: 'development', label: 'Development' },
  //   { value: 'business', label: 'Business' },
  //   { value: 'finance', label: 'Finance & Accounting' },
  //   { value: 'it-software', label: 'IT & Software' },
  //   { value: 'office', label: 'Office Productivity' },
  //   { value: 'design', label: 'Design' },
  //   { value: 'marketing', label: 'Marketing' },
  //   { value: 'lifestyle', label: 'Lifestyle' },
  //   { value: 'photography', label: 'Photography & Video' },
  //   { value: 'health', label: 'Health & Fitness' },
  //   { value: 'music', label: 'Music' },
  //   { value: 'teaching', label: 'Teaching & Academics' }
  // ];
categories:Category[]=[]


  constructor(private stepperService: StepperService,private cat:CategoryService,private cdr:ChangeDetectorRef) {


   }

  ngOnInit(): void {

    this.cat.getCategories().subscribe(data=>{
        this.categories=data
        this.cdr.detectChanges()
   })
    this.stepperService.formData$.subscribe(data => {
      this.category = data.category ?? '';
    });
  }

  onCategoryChange(category: number): void {
    this.stepperService.updateFormData({ category });
  }
}
