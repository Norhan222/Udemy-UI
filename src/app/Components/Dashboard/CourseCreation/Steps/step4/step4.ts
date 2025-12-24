import { Component } from '@angular/core';
import { StepperService } from '../../../../../Services/stepper-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step4',
  imports: [FormsModule],
  templateUrl: './step4.html',
  styleUrl: './step4.css',
})
export class Step4 {
 description = '';

  constructor(private stepperService: StepperService) {}

  ngOnInit(): void {
    this.stepperService.formData$.subscribe(data => {
      this.description = data.description;
    });
  }

  onDescriptionChange(description: string): void {
    this.stepperService.updateFormData({ description });
  }
}
