import { Component, OnInit } from '@angular/core';
import { StepperService } from '../../../../Services/stepper-service';
import { Router } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-stepper-footer',
  imports: [TranslateModule],
  templateUrl: './stepper-footer.html',
  styleUrl: './stepper-footer.css',
})
export class StepperFooter implements OnInit {

  currentStep = 1;
  totalSteps = 4;
  isCurrentStepValid = false;

  constructor(private stepperService: StepperService, private router: Router) { }

  ngOnInit(): void {
    this.stepperService.currentStep$.subscribe(step => {
      this.currentStep = step;
      this.checkStepValidity();
    });

    this.stepperService.formData$.subscribe(() => {
      this.checkStepValidity();
    });

    this.totalSteps = this.stepperService.totalSteps;
  }

  checkStepValidity(): void {
    this.isCurrentStepValid = this.stepperService.isStepValid(this.currentStep);
  }

  onPrevious(): void {
    this.stepperService.previousStep();
  }

  onContinue(): void {
    if (this.isCurrentStepValid) {
      if (this.currentStep === this.totalSteps) {
        this.router.navigate(['/complete-creation-course']);
        // this.createCourse();
      } else {
        this.stepperService.nextStep();
      }
    }
  }

  createCourse(): void {
    const formData = this.stepperService.getFormData();
    console.log('Creating course with data:', formData);
    alert('Course created successfully! 🎉');
    // هنا ممكن تضيف API call
  }
}
