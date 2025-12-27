import { Component } from '@angular/core';
import { StepperService } from '../../../../../Services/stepper-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step3',
  imports: [FormsModule,CommonModule],
  templateUrl: './step3.html',
  styleUrl: './step3.css',
})
export class Step3 {
category = '';

  categories = [
    { value: 'development', label: 'Development' },
    { value: 'business', label: 'Business' },
    { value: 'finance', label: 'Finance & Accounting' },
    { value: 'it-software', label: 'IT & Software' },
    { value: 'office', label: 'Office Productivity' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'photography', label: 'Photography & Video' },
    { value: 'health', label: 'Health & Fitness' },
    { value: 'music', label: 'Music' },
    { value: 'teaching', label: 'Teaching & Academics' }
  ];

  constructor(private stepperService: StepperService) {}

  ngOnInit(): void {
    this.stepperService.formData$.subscribe(data => {
      this.category = data.category??'';
    });
  }

  onCategoryChange(category: string): void {
    this.stepperService.updateFormData({ category });
  }
}
