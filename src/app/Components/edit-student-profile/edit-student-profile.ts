import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../Services/auth-service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-student-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './edit-student-profile.html',
  styleUrl: './edit-student-profile.css'
})
export class EditStudentProfile implements OnInit {

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
    headline: new FormControl('', Validators.maxLength(60)),
    biography: new FormControl('', Validators.maxLength(1000)),
    language: new FormControl('English (US)')
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
    this.authService.getStudentProfile().subscribe(res => {
      this.profileForm.patchValue(res);
      this.imagePreview = res.profileImageUrl;
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
    formData.append('Headline', this.profileForm.value.headline || '');
    formData.append('Biography', this.profileForm.value.biography || '');
    formData.append('Language', this.profileForm.value.language!);

    if (this.selectedFile) {
      formData.append('ProfileImage', this.selectedFile);
    }

    this.authService.updateStudentProfile(formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = this.translate.instant('PROFILE.PROFILE_UPDATED');
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = this.translate.instant('PROFILE.UPDATE_FAILED');
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
