import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
declare const jasmine: any;
import { EditStudentProfile } from './edit-student-profile';
import { AuthService } from '../../Services/auth-service';

describe('EditStudentProfile', () => {
  let component: EditStudentProfile;
  let fixture: ComponentFixture<EditStudentProfile>;
  const mockProfile = { FirstName: 'Jane', LastName: 'Doe', Bio: 'Student bio' };
  const authSpy = jasmine.createSpyObj('AuthService', ['getStudentProfile', 'updateStudentProfile', 'setProfileImage']);

  beforeEach(async () => {
    authSpy.getStudentProfile.and.returnValue(of(mockProfile));
    authSpy.updateStudentProfile.and.returnValue(of({ FirstName: 'Jane', LastName: 'Doe' }));

    await TestBed.configureTestingModule({
      imports: [EditStudentProfile],
      providers: [{ provide: AuthService, useValue: authSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(EditStudentProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate form with profile values', async () => {
    await fixture.whenStable();
    expect(component.profileForm.get('firstName')!.value).toBe('Jane');
    expect(component.profileForm.get('lastName')!.value).toBe('Doe');
    expect(component.profileForm.get('bio')!.value).toBe('Student bio');
  });

  it('should show error for non-image file', () => {
    const fakeEvent: any = { target: { files: [ { type: 'text/plain', size: 100 } ] } };
    component.onFileChange(fakeEvent);
    expect(component.errorMessage).toContain('Only image files');
  });

  it('should call updateStudentProfile on submit and set successMessage', () => {
    component.profileForm.patchValue({ firstName: 'John', lastName: 'Smith', bio: 'x' });
    component.onSubmit();
    expect(authSpy.updateStudentProfile).toHaveBeenCalled();
    expect(component.successMessage).toContain('Profile updated');
  });

  it('should set imagePreview and call setProfileImage with cache-busted URL when server returns profileImageUrl', () => {
    // arrange: return a profileImageUrl from update
    const returned = { profileImageUrl: '/images/profile/new.png' };
    authSpy.updateStudentProfile.and.returnValue(of(returned));

    component.profileForm.patchValue({ firstName: 'John', lastName: 'Smith', bio: 'x' });
    component.onSubmit();

    // imagePreview should contain the returned path with ?v= timestamp
    expect(typeof component.imagePreview).toBe('string');
    const preview = String(component.imagePreview);
    expect(preview).toContain('/images/profile/new.png');
    expect(preview).toMatch(/[?&]v=\d+/);

    // auth.setProfileImage should have been called with the same busted string
    expect(authSpy.setProfileImage).toHaveBeenCalled();
    const calledArg = authSpy.setProfileImage.calls.mostRecent().args[0];
    expect(calledArg).toContain('/images/profile/new.png');
    expect(calledArg).toMatch(/[?&]v=\d+/);
  });
});
