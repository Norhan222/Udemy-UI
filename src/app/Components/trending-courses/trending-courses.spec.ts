import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingCourses } from './trending-courses';

describe('TrendingCourses', () => {
  let component: TrendingCourses;
  let fixture: ComponentFixture<TrendingCourses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrendingCourses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingCourses);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
