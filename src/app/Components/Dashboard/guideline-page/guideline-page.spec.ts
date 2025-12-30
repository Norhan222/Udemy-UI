import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidelinePage } from './guideline-page';

describe('GuidelinePage', () => {
  let component: GuidelinePage;
  let fixture: ComponentFixture<GuidelinePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuidelinePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuidelinePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
