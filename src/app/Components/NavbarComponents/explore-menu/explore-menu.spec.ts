import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreMenu } from './explore-menu';

describe('ExploreMenu', () => {
  let component: ExploreMenu;
  let fixture: ComponentFixture<ExploreMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
