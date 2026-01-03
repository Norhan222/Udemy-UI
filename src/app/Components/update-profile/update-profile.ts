import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../Services/auth-service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './update-profile.html',
  styleUrl: './update-profile.css'
})
export class UpdateProfileComponent implements OnInit {

  private authService = inject(AuthService);
  private translate = inject(TranslateService);

  activeSection: 'profile' | 'password' = 'profile';

  isLoading = false;
  isPasswordLoading = false;

  successMessage = '';
  errorMessage = '';
  passwordSuccessMessage = '';
  passwordErrorMessage = '';

  imagePreview: string | null = null;
  selectedFile: File | null = null;

  profileForm = new FormGroup({
  firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
  lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
  email: new FormControl('', [Validators.required, Validators.email]),
  phoneNumber: new FormControl('', [
    Validators.required,
    Validators.pattern(/^(01)[0-9]{9}$/) // مصري
  ])
});

  passwordForm = new FormGroup(
    {
      currentPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmNewPassword: new FormControl('', Validators.required)
    },
    { validators: this.passwordMatchValidator }
  );

  languageOptions = ['English (US)', 'العربية'];

  ngOnInit(): void {
    this.loadProfile();
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const g = control as FormGroup;
    return g.value.newPassword === g.value.confirmNewPassword ? null : { passwordMismatch: true };
  }

  scrollTo(section: 'profile' | 'password') {
    this.activeSection = section;
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }

  @HostListener('window:scroll')
  onScroll() {
    const p = document.getElementById('profile')?.getBoundingClientRect().top || 0;
    const pw = document.getElementById('password')?.getBoundingClientRect().top || 0;
    this.activeSection = Math.abs(p) < Math.abs(pw) ? 'profile' : 'password';
  }

  loadProfile() {
  this.authService.getProfile().subscribe(res => {

    this.profileForm.patchValue({
      firstName: res.firstName,
      lastName: res.lastName,
      email: res.email,
      phoneNumber: res.phoneNumber
    });

    if (res.profileImageUrl) {
      this.imagePreview = res.profileImageUrl;
      this.authService.setProfileImage(res.profileImageUrl);
    }
  });
}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result as string;
    reader.readAsDataURL(file);
  }

 onSubmit() {
  if (this.profileForm.invalid) return;

  this.isLoading = true;
  this.successMessage = '';
  this.errorMessage = '';

  const formData = new FormData();
  formData.append('FirstName', this.profileForm.value.firstName!);
  formData.append('LastName', this.profileForm.value.lastName!);
  formData.append('Email', this.profileForm.value.email!);
  formData.append('PhoneNumber', this.profileForm.value.phoneNumber!);

  if (this.selectedFile) {
    formData.append('ProfileImage', this.selectedFile);
  }

  this.authService.updateProfile(formData).subscribe({
    next: (res) => {
      this.isLoading = false;
      this.successMessage = 'Profile updated successfully';

      if (res?.profileImageUrl) {
        const img = `${res.profileImageUrl}?v=${Date.now()}`;
        this.imagePreview = img;
        this.authService.setProfileImage(img);
      }

      this.authService.setFirstName(this.profileForm.value.firstName!);
    },
    error: () => {
      this.isLoading = false;
      this.errorMessage = 'Failed to update profile';
    }
  });
}


  onPasswordSubmit() {
    if (this.passwordForm.invalid) return;

    this.isPasswordLoading = true;
    this.passwordErrorMessage = '';
    this.passwordSuccessMessage = '';

    const payload = {
      currentPassword: this.passwordForm.value.currentPassword!,
      newPassword: this.passwordForm.value.newPassword!,
      confirmNewPassword: this.passwordForm.value.confirmNewPassword!
    };


    this.authService.changePassword(payload).subscribe({
      next: () => {
        this.isPasswordLoading = false;
        this.passwordSuccessMessage = this.translate.instant('PROFILE.PASSWORD_CHANGED');
        this.passwordForm.reset();
      },
      error: (err) => {
        this.isPasswordLoading = false;
        this.passwordErrorMessage = err.error?.message || this.translate.instant('PROFILE.CURRENT_PASSWORD_INCORRECT');
      }
    });
  }

}
