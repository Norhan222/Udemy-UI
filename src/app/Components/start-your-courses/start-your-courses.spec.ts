import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartYourCourses } from './start-your-courses';

describe('StartYourCourses', () => {
  let component: StartYourCourses;
  let fixture: ComponentFixture<StartYourCourses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartYourCourses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartYourCourses);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
