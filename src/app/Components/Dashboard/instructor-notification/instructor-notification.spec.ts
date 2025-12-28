import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorNotification } from './instructor-notification';

describe('InstructorNotification', () => {
  let component: InstructorNotification;
  let fixture: ComponentFixture<InstructorNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorNotification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorNotification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
