import { Component } from '@angular/core';
import { StepperService } from '../../../../Services/stepper-service';
import { CommonModule } from '@angular/common';
import { StepperHeader } from '../stepper-header/stepper-header';
import { StepperFooter } from '../stepper-footer/stepper-footer';
import { Step2 } from '../Steps/step2/step2';
import { Step1 } from '../Steps/step1/step1';
import { Step3 } from '../Steps/step3/step3';
import { Step4 } from '../Steps/step4/step4';

@Component({
  selector: 'app-course-creation-stepper',
  imports: [CommonModule,
    StepperHeader,
    StepperFooter,
    Step1,
    Step2,
    Step3,
    Step4],
  templateUrl: './course-creation-stepper.html',
  styleUrl: './course-creation-stepper.css',
})
export class CourseCreationStepper {
currentStep = 1;

  constructor(private stepperService: StepperService) {}

  ngOnInit(): void {
    this.stepperService.currentStep$.subscribe(step => {
      this.currentStep = step;
    });
  }
}
