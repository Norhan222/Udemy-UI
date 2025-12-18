import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsRecommended } from './topics-recommended';

describe('TopicsRecommended', () => {
  let component: TopicsRecommended;
  let fixture: ComponentFixture<TopicsRecommended>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicsRecommended]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicsRecommended);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
