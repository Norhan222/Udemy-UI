import { Component, OnInit } from '@angular/core';
import { StepperService } from '../../../../../Services/stepper-service';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-step1',
  imports: [TranslateModule],
  templateUrl: './step1.html',
  styleUrl: './step1.css',
})
export class Step1 implements OnInit {
  selectedType = '';

  constructor(private stepperService: StepperService) { }

  ngOnInit(): void {
    this.stepperService.formData$.subscribe(data => {
      this.selectedType = data.courseType ?? '';
    });
  }

  selectCourseType(type: string): void {
    this.selectedType = type;
    this.stepperService.updateFormData({ courseType: type });
  }
}
