import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-instructor-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-instructor-profile.html',
  styleUrl: './edit-instructor-profile.css'
})
export class EditInstructorProfile {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  avatarPreview: string | ArrayBuffer | null = null;
  coverPreview: string | ArrayBuffer | null = null;
  avatarFile: File | null = null;
  coverFile: File | null = null;

  profileForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    bio: new FormControl('', [Validators.maxLength(2000)]),
    expertise: new FormControl('', [Validators.maxLength(500)]), // comma-separated or tags
    website: new FormControl('', [Validators.pattern('https?://.+')]),
    twitter: new FormControl('', [Validators.maxLength(200)]),
    linkedin: new FormControl('', [Validators.maxLength(200)])
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    // Try instructor endpoint first. Fallbacks handled in service
    this.authService.getInstructorProfile().subscribe({
      next: (res) => {
        const firstName = res.firstName ?? res.FirstName ?? '';
        const lastName = res.lastName ?? res.LastName ?? '';
        const bio = res.bio ?? res.Bio ?? '';
        const expertise = res.expertise ?? res.Expertise ?? '';
        const website = res.website ?? res.Website ?? '';
        const twitter = res.twitter ?? res.Twitter ?? '';
        const linkedin = res.linkedin ?? res.LinkedIn ?? '';
        const avatar = res.profileImageUrl ?? res.profileImage ?? res.profileImagePath ?? null;
        const cover = res.coverImageUrl ?? res.coverImage ?? null;

        this.profileForm.patchValue({ firstName, lastName, bio, expertise, website, twitter, linkedin });
        if (avatar) {
          this.avatarPreview = avatar;
          try { this.authService.setProfileImage(avatar); } catch {}
        }
        if (cover) this.coverPreview = cover;
      },
      error: (err) => {
        console.warn('No instructor profile endpoint or failed to load', err);
      }
    })
  }

  onAvatarChange(e: any) {
    const file: File = e.target.files && e.target.files[0];
    this.errorMessage = '';
    if (!file) return;
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    if (!file.type.startsWith('image/')) { this.errorMessage = 'Avatar must be an image.'; return; }
    if (file.size > MAX_FILE_SIZE) { this.errorMessage = 'Avatar must be 2 MB or smaller.'; return; }
    this.avatarFile = file;
    const reader = new FileReader();
    reader.onload = () => this.avatarPreview = reader.result;
    reader.readAsDataURL(file);
  }

  onCoverChange(e: any) {
    const file: File = e.target.files && e.target.files[0];
    this.errorMessage = '';
    if (!file) return;
    const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB for cover
    if (!file.type.startsWith('image/')) { this.errorMessage = 'Cover must be an image.'; return; }
    if (file.size > MAX_FILE_SIZE) { this.errorMessage = 'Cover image must be 3 MB or smaller.'; return; }
    this.coverFile = file;
    const reader = new FileReader();
    reader.onload = () => this.coverPreview = reader.result;
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.profileForm.invalid) return;
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('FirstName', this.profileForm.get('firstName')!.value);
    formData.append('LastName', this.profileForm.get('lastName')!.value);
    formData.append('Bio', this.profileForm.get('bio')!.value || '');
    formData.append('Expertise', this.profileForm.get('expertise')!.value || '');
    formData.append('Website', this.profileForm.get('website')!.value || '');
    formData.append('Twitter', this.profileForm.get('twitter')!.value || '');
    formData.append('LinkedIn', this.profileForm.get('linkedin')!.value || '');

    if (this.avatarFile) formData.append('ProfileImage', this.avatarFile, this.avatarFile.name);
    if (this.coverFile) formData.append('CoverImage', this.coverFile, this.coverFile.name);

    try {
      const entries: string[] = [];
      for (const pair of (formData as any).entries()) {
        const [k, v] = pair as [string, any];
        if (v instanceof File) entries.push(`${k}: File(${v.name}, ${v.type}, ${v.size})`);
        else entries.push(`${k}: ${String(v)}`);
      }
      console.debug('Submitting Instructor FormData:', entries.join('; '));
    } catch (e) {
      console.debug('FormData debug failed', e);
    }

    this.authService.updateInstructorProfile(formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = 'Instructor profile updated successfully.';
        if (res.firstName || res.FirstName) {
          const newFirst = res.firstName ?? res.FirstName;
          this.authService.firstName.next(newFirst);
        }
        const avatar = res.profileImageUrl ?? res.profileImage ?? res.profileImagePath ?? null;
        const cover = res.coverImageUrl ?? res.coverImage ?? null;
        if (avatar) {
          const busted = `${avatar}${avatar.includes('?') ? '&' : '?'}v=${Date.now()}`;
          this.avatarPreview = busted;
          try { this.authService.setProfileImage(busted); } catch {}
        }
        if (cover) this.coverPreview = cover;
      },
      error: (err) => {
        console.error('Failed to update instructor profile', err);
        this.isLoading = false;
        if (err?.error) {
          const serverErr = err.error;
          if (typeof serverErr === 'string') {
            this.errorMessage = serverErr;
          } else if (serverErr.message) {
            this.errorMessage = serverErr.message;
          } else if (serverErr.errors) {
            try {
              const vals = Object.values(serverErr.errors).flat();
              this.errorMessage = vals.join('; ');
            } catch {
              this.errorMessage = JSON.stringify(serverErr.errors);
            }
          } else {
            this.errorMessage = JSON.stringify(serverErr);
          }
        } else {
          this.errorMessage = `Request failed (${err?.status ?? 'unknown'})`;
        }
      }
    })
  }
}
