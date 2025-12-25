import { Component } from '@angular/core';
import { StepperService } from '../../../../Services/stepper-service';
import { Router } from '@angular/router';

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

  constructor(private stepperService: StepperService, private router: Router) {}

  ngOnInit(): void {
    this.stepperService.currentStep$.subscribe(step => {
      this.currentStep = step;
      this.progressPercentage = this.stepperService.getProgressPercentage();
    });

    this.totalSteps = this.stepperService.totalSteps;
  }

  onExit(): void {

      this.stepperService.resetStepper();
    this.router.navigate(['/dashboard/courses']);
  }
}
