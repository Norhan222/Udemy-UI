import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceLayout } from './performance-layout';

describe('PerformanceLayout', () => {
  let component: PerformanceLayout;
  let fixture: ComponentFixture<PerformanceLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
