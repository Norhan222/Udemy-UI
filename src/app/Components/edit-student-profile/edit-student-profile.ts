import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../Services/auth-service';

@Component({
  selector: 'app-edit-student-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-student-profile.html',
  styleUrl: './edit-student-profile.css',
})
export class EditStudentProfile implements OnInit {

  private authService = inject(AuthService);

  isLoading = false;
  isPasswordLoading = false;
  successMessage = '';
  errorMessage = '';
  passwordSuccessMessage = '';
  passwordErrorMessage = '';

  imagePreview: string | null = null;
  selectedFile: File | null = null;

  // Profile form with all Udemy fields
  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    headline: new FormControl('', [Validators.maxLength(60)]),
    biography: new FormControl('', [Validators.maxLength(1000)]),
    language: new FormControl('English (US)'),
    website: new FormControl('', [Validators.pattern('https?://.+')]),
    twitter: new FormControl('', [Validators.pattern('https?://(www\\.)?twitter\\.com/.+')]),
    facebook: new FormControl('', [Validators.pattern('https?://(www\\.)?facebook\\.com/.+')]),
    linkedin: new FormControl('', [Validators.pattern('https?://(www\\.)?linkedin\\.com/.+')]),
    youtube: new FormControl('', [Validators.pattern('https?://(www\\.)?youtube\\.com/.+')])
  });

  passwordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmNewPassword: new FormControl('', [Validators.required])
  });

  languageOptions = [
    'English (US)',
    'Español (Spanish)',
    'Português (Portuguese)',
    'Deutsch (German)',
    'Français (French)',
    '日本語 (Japanese)',
    '中文 (Chinese)',
    'العربية (Arabic)'
  ];

  ngOnInit(): void {
    this.loadProfile();
    this.passwordForm.setValidators([this.passwordMatchValidator]);
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const group = control as FormGroup;
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmNewPassword')?.value;
    
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  loadProfile() {
    this.authService.getStudentProfile().subscribe({
      next: (res: any) => {
        this.profileForm.patchValue({
          firstName: res.firstName || '',
          lastName: res.lastName || '',
          headline: res.headline || '',
          biography: res.biography || '',
          language: res.language || 'English (US)',
          website: res.website || '',
          twitter: res.twitter || '',
          facebook: res.facebook || '',
          linkedin: res.linkedin || '',
          youtube: res.youtube || ''
        });

        if (res.profileImageUrl) {
          this.imagePreview = res.profileImageUrl;
          this.authService.setProfileImage(res.profileImageUrl);
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load profile';
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Only image files are allowed';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'Image size must be less than 5MB';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  getCharacterCount(controlName: string): number {
    return this.profileForm.get(controlName)?.value?.length || 0;
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    formData.append('FirstName', this.profileForm.value.firstName!);
    formData.append('LastName', this.profileForm.value.lastName!);
    formData.append('Headline', this.profileForm.value.headline || '');
    formData.append('Biography', this.profileForm.value.biography || '');
    formData.append('Language', this.profileForm.value.language || 'English (US)');
    formData.append('Website', this.profileForm.value.website || '');
    formData.append('Twitter', this.profileForm.value.twitter || '');
    formData.append('Facebook', this.profileForm.value.facebook || '');
    formData.append('LinkedIn', this.profileForm.value.linkedin || '');
    formData.append('YouTube', this.profileForm.value.youtube || '');

    if (this.selectedFile) {
      formData.append('ProfileImage', this.selectedFile);
    }

    this.authService.updateStudentProfile(formData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.successMessage = 'Profile updated successfully';
        
        setTimeout(() => this.successMessage = '', 5000);

        this.authService.setFirstName(this.profileForm.value.firstName!);

        if (res.profileImage) {
          const img = res.profileImage + '?v=' + Date.now();
          this.authService.setProfileImage(img);
          this.imagePreview = img;
        }
        this.authService.setUser(res);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to update profile. Please try again.';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  onPasswordSubmit() {
    if (this.passwordForm.invalid) {
      Object.keys(this.passwordForm.controls).forEach(key => {
        this.passwordForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isPasswordLoading = true;
    this.passwordErrorMessage = '';
    this.passwordSuccessMessage = '';

    const passwordData = {
      currentPassword: this.passwordForm.value.currentPassword!,
      newPassword: this.passwordForm.value.newPassword!,
      confirmNewPassword: this.passwordForm.value.confirmNewPassword!
    };

    this.authService.changePassword(passwordData).subscribe({
      next: () => {
        this.isPasswordLoading = false;
        this.passwordSuccessMessage = 'Password changed successfully';
        this.passwordForm.reset();
        setTimeout(() => this.passwordSuccessMessage = '', 5000);
      },
      error: (err) => {
        this.isPasswordLoading = false;
        this.passwordErrorMessage = err.error?.message || 'Failed to change password. Please check your current password and try again.';
        setTimeout(() => this.passwordErrorMessage = '', 5000);
      }
    });
  }
}