import { Component } from '@angular/core';
import { StepperService } from '../../../../Services/stepper-service';

@Component({
  selector: 'app-stepper-header',
  imports: [],
  templateUrl: './stepper-header.html',
  styleUrl: './stepper-header.css',
})
export class StepperHeader {
currentStep = 1;
  totalSteps = 4;
  progressPercentage = 0;

  constructor(private stepperService: StepperService) {}

  ngOnInit(): void {
    this.stepperService.currentStep$.subscribe(step => {
      this.currentStep = step;
      this.progressPercentage = this.stepperService.getProgressPercentage();
    });
    
    this.totalSteps = this.stepperService.totalSteps;
  }

  onExit(): void {
    if (confirm('هل أنت متأكد من الخروج؟ سيتم فقدان التقدم الحالي.')) {
      this.stepperService.resetStepper();
    }
  }
}
