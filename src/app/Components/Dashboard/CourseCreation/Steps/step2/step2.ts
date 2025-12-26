import { Component, OnInit } from '@angular/core';
import { StepperService } from '../../../../../Services/stepper-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step2',
  imports: [FormsModule],
  templateUrl: './step2.html',
  styleUrl: './step2.css',
})
export class Step2 implements OnInit {
courseTitle = '';

  constructor(private stepperService: StepperService) {}

  ngOnInit(): void {
    this.stepperService.formData$.subscribe(data => {
      this.courseTitle = data.courseTitle??'';
    });
  }

  onTitleChange(title: string): void {
    this.stepperService.updateFormData({ courseTitle: title });
  }
}
