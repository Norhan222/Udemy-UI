import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCreationStepper } from './course-creation-stepper';

describe('CourseCreationStepper', () => {
  let component: CourseCreationStepper;
  let fixture: ComponentFixture<CourseCreationStepper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCreationStepper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseCreationStepper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
