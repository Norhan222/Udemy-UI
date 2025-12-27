import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBeforSignIn } from './home-befor-sign-in';

describe('HomeBeforSignIn', () => {
  let component: HomeBeforSignIn;
  let fixture: ComponentFixture<HomeBeforSignIn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeBeforSignIn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeBeforSignIn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
