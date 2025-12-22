import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalTopics } from './technical-topics';

describe('TechnicalTopics', () => {
  let component: TechnicalTopics;
  let fixture: ComponentFixture<TechnicalTopics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalTopics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalTopics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
