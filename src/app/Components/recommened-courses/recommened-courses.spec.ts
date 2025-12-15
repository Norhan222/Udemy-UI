import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommenedCourses } from './recommened-courses';

describe('RecommenedCourses', () => {
  let component: RecommenedCourses;
  let fixture: ComponentFixture<RecommenedCourses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommenedCourses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommenedCourses);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
