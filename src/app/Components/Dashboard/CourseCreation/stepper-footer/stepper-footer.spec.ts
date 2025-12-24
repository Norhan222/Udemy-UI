import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperFooter } from './stepper-footer';

describe('StepperFooter', () => {
  let component: StepperFooter;
  let fixture: ComponentFixture<StepperFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
