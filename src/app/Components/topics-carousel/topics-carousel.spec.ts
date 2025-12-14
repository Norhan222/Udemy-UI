import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsCarousel } from './topics-carousel';

describe('TopicsCarousel', () => {
  let component: TopicsCarousel;
  let fixture: ComponentFixture<TopicsCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicsCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicsCarousel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
