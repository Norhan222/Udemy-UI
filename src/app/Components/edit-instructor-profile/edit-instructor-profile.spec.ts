import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
declare const jasmine: any;
import { EditInstructorProfile } from './edit-instructor-profile';
import { AuthService } from '../../Services/auth-service';

describe('EditInstructorProfile', () => {
  let component: EditInstructorProfile;
  let fixture: ComponentFixture<EditInstructorProfile>;
  const mockProfile = { FirstName: 'Alice', LastName: 'Instructor', Expertise: 'Angular,JS', Website: 'https://example.com' };
  const authSpy = jasmine.createSpyObj('AuthService', ['getInstructorProfile', 'updateInstructorProfile']);

  beforeEach(async () => {
    authSpy.getInstructorProfile.and.returnValue(of(mockProfile));
    authSpy.updateInstructorProfile.and.returnValue(of({ FirstName: 'Alice' }));

    await TestBed.configureTestingModule({
      imports: [EditInstructorProfile],
      providers: [{ provide: AuthService, useValue: authSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(EditInstructorProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load instructor profile into form', async () => {
    await fixture.whenStable();
    expect(component.profileForm.get('firstName')!.value).toBe('Alice');
    expect(component.profileForm.get('expertise')!.value).toBe('Angular,JS');
  });

  it('should reject too-large avatar', () => {
    const bigFile: any = { type: 'image/png', size: 5 * 1024 * 1024 } as File;
    const fakeEvent: any = { target: { files: [bigFile] } };
    component.onAvatarChange(fakeEvent);
    expect(component.errorMessage).toContain('2 MB');
  });

  it('should call updateInstructorProfile and set successMessage', () => {
    component.profileForm.patchValue({ firstName: 'Alice', lastName: 'I' });
    component.onSubmit();
    expect(authSpy.updateInstructorProfile).toHaveBeenCalled();
    expect(component.successMessage).toContain('Instructor profile updated');
  });
});
