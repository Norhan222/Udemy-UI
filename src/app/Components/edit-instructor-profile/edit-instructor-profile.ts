import { Component, inject, OnInit } from '@angular/core';
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
export class EditInstructorProfile implements OnInit {

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

  ngOnInit(): void {
    this.auth.getInstructorProfile().subscribe({
      next: res => {
        this.profileForm.patchValue({
          firstName: res.firstName,
          lastName: res.lastName,
          bio: res.bio
        });

        if (res.profileImageUrl) {
          const img = res.profileImageUrl;
          this.avatarPreview = img;
          this.auth.profileImage.next(img); // 🔥 sync navbar
        }
      }
    });
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) return;

    this.avatarFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
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

    if (this.avatarFile) {
      formData.append('ProfileImage', this.avatarFile);
    }

    this.auth.updateInstructorProfile(formData).subscribe({
      next: res => {
        this.loading = false;
        this.successMessage = 'Profile saved successfully';

        if (res?.profileImageUrl) {
          const img = `${res.profileImageUrl}?v=${Date.now()}`;
          this.avatarPreview = img;

          // 🔥 update everywhere instantly
          this.auth.setProfileImage(img);
          this.auth.profileImage.next(img);
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
