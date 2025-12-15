import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurpPlans } from './ourp-plans';

describe('OurpPlans', () => {
  let component: OurpPlans;
  let fixture: ComponentFixture<OurpPlans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurpPlans]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurpPlans);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
