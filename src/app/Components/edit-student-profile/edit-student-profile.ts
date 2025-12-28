import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
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
  successMessage = '';
  errorMessage = '';

  imagePreview: string | null = null;
  selectedFile: File | null = null;

  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)])
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.authService.getStudentProfile().subscribe({
      next: (res: any) => {
        this.profileForm.patchValue({
          firstName: res.firstName,
          lastName: res.lastName
        });

        if (res.profileImage) {
          this.imagePreview = res.profileImage;
          this.authService.setProfileImage(res.profileImage);
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
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    formData.append('FirstName', this.profileForm.value.firstName!);
    formData.append('LastName', this.profileForm.value.lastName!);

    if (this.selectedFile) {
      formData.append('ProfileImage', this.selectedFile);
    }

    this.authService.updateStudentProfile(formData).subscribe({
    next: (res: any) => {
      this.isLoading = false;
      this.successMessage = 'Profile updated successfully';

      // ✅ update name immediately
      this.authService.setFirstName(this.profileForm.value.firstName!);

      // ✅ update image immediately (cache bust)
      if (res.profileImage) {
        const img = res.profileImage + '?v=' + Date.now();
        this.authService.setProfileImage(img);
        this.imagePreview = img;
      }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Failed to update profile';
      }
    });
  }
}
