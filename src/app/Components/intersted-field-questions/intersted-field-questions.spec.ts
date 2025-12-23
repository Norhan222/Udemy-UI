import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterstedFieldQuestions } from './intersted-field-questions';

describe('InterstedFieldQuestions', () => {
  let component: InterstedFieldQuestions;
  let fixture: ComponentFixture<InterstedFieldQuestions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterstedFieldQuestions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterstedFieldQuestions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
