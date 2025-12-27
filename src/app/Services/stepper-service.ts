import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class StepperService {
  private currentStepSubject = new BehaviorSubject<number>(1);
  currentStep$ = this.currentStepSubject.asObservable();

  private formDataSubject = new BehaviorSubject<CourseFormData>({
    courseType: '',
    courseTitle: '',
    category: '',
    description: ''
  });
  formData$ = this.formDataSubject.asObservable();

  readonly totalSteps = 4;

  getCurrentStep(): number {
    return this.currentStepSubject.value;
  }

  setCurrentStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStepSubject.next(step);
    }
  }

  nextStep(): void {
    const current = this.getCurrentStep();
    if (current < this.totalSteps) {
      this.setCurrentStep(current + 1);
    }
  }

  previousStep(): void {
    const current = this.getCurrentStep();
    if (current > 1) {
      this.setCurrentStep(current - 1);
    }
  }

  getFormData(): CourseFormData {
    return this.formDataSubject.value;
  }

  updateFormData(data: Partial<CourseFormData>): void {
    const currentData = this.getFormData();
    this.formDataSubject.next({ ...currentData, ...data });
  }

  resetStepper(): void {
    this.currentStepSubject.next(1);
    this.formDataSubject.next({
      courseType: '',
      courseTitle: '',
      category: '',
      description: ''
    });
  }

  isStepValid(step: number): boolean {
    const data = this.getFormData();

    switch (step) {
      case 1:
        return data.courseType !== '';
      case 2:
        return data.courseTitle?.trim() !== '';
      case 3:
        return data.category !== '';
      case 4:
        return data.description?.trim() !== '';           //length >200
      default:
        return false;
    }
  }

  getProgressPercentage(): number {
    return (this.getCurrentStep() / this.totalSteps) * 100;
  }
}
export interface CourseFormData {
  courseType: string | null;
  courseTitle: string | null;
  category: string | null;
  description: string   | null;
}
