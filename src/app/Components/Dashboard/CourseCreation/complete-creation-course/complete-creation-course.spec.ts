import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteCreationCourse } from './complete-creation-course';

describe('CompleteCreationCourse', () => {
  let component: CompleteCreationCourse;
  let fixture: ComponentFixture<CompleteCreationCourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteCreationCourse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteCreationCourse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
