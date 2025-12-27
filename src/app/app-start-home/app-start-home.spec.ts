import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppStartHome } from './app-start-home';

describe('AppStartHome', () => {
  let component: AppStartHome;
  let fixture: ComponentFixture<AppStartHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppStartHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppStartHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
