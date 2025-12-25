import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { UserMenu } from './user-menu';
import { AuthService } from '../../../Services/auth-service';

describe('UserMenu', () => {
  let component: UserMenu;
  let fixture: ComponentFixture<UserMenu>;

  const profileImageSubject = new BehaviorSubject<string | null>(null);
  const mockAuth: any = {
    profileImage$: profileImageSubject.asObservable(),
    profileImage: profileImageSubject,
    getStudentProfile: () => of({}),
    getInstructorProfile: () => of({})
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMenu],
      providers: [{ provide: AuthService, useValue: mockAuth }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update user.profileImageUrl when auth.profileImage$ emits', () => {
    const testUrl = '/images/profile/test.png?v=1';
    profileImageSubject.next(testUrl);
    expect(component.user.profileImageUrl).toBe(testUrl);
  });
});
