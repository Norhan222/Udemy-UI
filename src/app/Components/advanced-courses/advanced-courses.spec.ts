import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedCourses } from './advanced-courses';

describe('AdvancedCourses', () => {
  let component: AdvancedCourses;
  let fixture: ComponentFixture<AdvancedCourses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedCourses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedCourses);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
