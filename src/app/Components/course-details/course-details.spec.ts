import { TestBed } from '@angular/core/testing';
import { CourseDetailsComponent } from './course-details';

describe('CourseDetailsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDetailsComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CourseDetailsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
