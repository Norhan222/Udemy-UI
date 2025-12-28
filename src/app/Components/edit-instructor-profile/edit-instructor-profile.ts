import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth-service';

@Component({
  selector: 'app-edit-instructor-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-instructor-profile.html',
  styleUrls: ['./edit-instructor-profile.css']
})
export class EditInstructorProfile {
  private auth = inject(AuthService);

  avatarPreview: string | null = null;
  avatarFile: File | null = null;
  loading = false;
  successMessage = '';

  profileForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    bio: new FormControl('')
  });

  ngOnInit() {
    this.auth.getInstructorProfile().subscribe(res => {
      this.profileForm.patchValue({
        firstName: res.firstName,
        lastName: res.lastName,
        bio: res.bio
      });

      if (res.profileImageUrl) {
        this.avatarPreview = res.profileImageUrl;
        this.auth.setProfileImage(res.profileImageUrl);
      }
    });
  }

  onAvatarChange(e: any) {
    this.avatarFile = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => this.avatarPreview = reader.result as string;
    reader.readAsDataURL(this.avatarFile!);
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.loading = true;
    this.successMessage = '';

    const formData = new FormData();
    const f = this.profileForm.value;

    formData.append('FirstName', f.firstName!);
    formData.append('LastName', f.lastName!);
    formData.append('Bio', f.bio || '');

    if (this.avatarFile)
      formData.append('ProfileImage', this.avatarFile);

    this.auth.updateInstructorProfile(formData).subscribe({
      next: res => {
        this.loading = false;
        this.successMessage = 'Profile saved successfully!';

        // Update avatar in navbar
        if (res.profileImageUrl) {
          const img = `${res.profileImageUrl}?v=${Date.now()}`;
          this.auth.setProfileImage(img);
          this.avatarPreview = img;
        }

        // Optionally, update full name in navbar
        // this.auth.setFullName(`${f.firstName} ${f.lastName}`);
      },
      error: err => {
        this.loading = false;
        console.error(err);
      }
    });
  }
}
