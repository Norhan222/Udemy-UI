import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-student-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-student-profile.html',
  styleUrl: './edit-student-profile.css',
})
export class EditStudentProfile {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  // if user explicitly removed avatar (so backend should delete it)
  removeImage: boolean = false;

  // field-specific server validation messages
  fileErrors: string[] = [];
  bioErrors: string[] = [];
  otherFieldErrors: { [key:string]: string[] } = {};

  profileForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    headline: new FormControl('', []),
    bio: new FormControl('', [Validators.maxLength(1000)]),
    website: new FormControl('', []),
    language: new FormControl('en', []),
    country: new FormControl('', [])
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  removeAvatar(inputEl?: HTMLInputElement) {
    // mark for removal and clear preview
    this.removeImage = true;
    this.selectedFile = null;
    this.imagePreview = null;
    // reset input element if provided
    try { if (inputEl) inputEl.value = ''; } catch {}
  }

  viewPublicProfile() {
    // navigate to public profile path (may be implemented later)
    try { this.router.navigate(['/Profile']); } catch { }
  }

  loadProfile() {
    this.authService.getStudentProfile().subscribe({
      next: (res) => {
        // Support different casing from backend
        const firstName = res.firstName ?? res.FirstName ?? '';
        const lastName = res.lastName ?? res.LastName ?? '';
        const bio = res.bio ?? res.Bio ?? '';
        const headline = res.headline ?? res.HeadLine ?? res.headLine ?? '';
        const website = res.website ?? res.Website ?? '';
        const language = res.language ?? res.Language ?? 'en';
        const country = res.country ?? res.Country ?? '';
        const profileImageUrl = res.profileImageUrl ?? res.profileImage ?? res.profileImagePath ?? null;

        this.profileForm.patchValue({ firstName, lastName, bio, headline, website, language, country });
        if (profileImageUrl) {
          this.imagePreview = profileImageUrl;
          // publish to shared auth service so other components (like the user menu) update immediately
          try { this.authService.setProfileImage(profileImageUrl); } catch {}
        }
      },
      error: (err) => {
        console.error('Failed to load profile', err);
      }
    })
  }

  onFileChange(e: any, inputEl?: HTMLInputElement) {
    const file: File = e.target.files && e.target.files[0];
    // Reset file-specific errors on new selection
    this.fileErrors = [];
    this.errorMessage = '';
    if (!file) return;
    // basic validation
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    if (!file.type.startsWith('image/')) {
      this.fileErrors.push('Only image files are allowed (JPG, PNG).');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      this.fileErrors.push('Image must be 2 MB or smaller.');
      return;
    }
    this.selectedFile = file;
    // user explicitly selected a file: clear remove flag
    this.removeImage = false;

    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result;
    reader.readAsDataURL(file);

    // Reset the native input so the same file can be selected again later
    try { if (inputEl) inputEl.value = ''; } catch {}
  }

  onSubmit() {
    if (this.profileForm.invalid) return;
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formData = new FormData();
    // Use DTO property names (matching backend UpdateProfileDto)
    formData.append('FirstName', this.profileForm.get('firstName')!.value);
    formData.append('LastName', this.profileForm.get('lastName')!.value);
    formData.append('HeadLine', this.profileForm.get('headline')!.value || '');
    formData.append('Bio', this.profileForm.get('bio')!.value || '');
    formData.append('Website', this.profileForm.get('website')!.value || '');
    formData.append('Language', this.profileForm.get('language')!.value || 'en');
    formData.append('Country', this.profileForm.get('country')!.value || '');

    if (this.selectedFile) {
      // Append common variants of the field name in case backend expects different casing
      formData.append('ProfileImage', this.selectedFile, this.selectedFile.name);
      formData.append('profileImage', this.selectedFile, this.selectedFile.name);
      // Include explicit filename helper fields some backends use
      formData.append('ProfileImageFileName', this.selectedFile.name);
      formData.append('ProfileImageName', this.selectedFile.name);
    }

    // Add flags for explicit removals (backend may honor these)
    if (this.removeImage) {
      formData.append('RemoveProfileImage', 'true');
    }
    const bioVal = this.profileForm.get('bio')!.value;
    if (bioVal === '' || bioVal === null) {
      // also append an explicit remove flag so backend can delete empty bio if supported
      formData.append('RemoveBio', 'true');
    }

    // Debug: list FormData entries (avoid dumping file content)
    try {
      const entries: string[] = [];
      for (const pair of (formData as any).entries()) {
        const [k, v] = pair as [string, any];
        if (v instanceof File) entries.push(`${k}: File(${v.name}, ${v.type}, ${v.size})`);
        else entries.push(`${k}: ${String(v)}`);
      }
      console.debug('Submitting FormData:', entries.join('; '));
      try { console.debug('Submitting to URL:', `${(this.authService as any).baseUrl}/student/profile`); } catch {}
    } catch (e) {
      console.debug('FormData debug failed', e);
    }

    // clear previous field errors
    this.fileErrors = [];
    this.bioErrors = [];
    this.otherFieldErrors = {};

    this.authService.updateStudentProfile(formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = 'Profile updated successfully.';
        // clear prior field errors
        this.fileErrors = [];
        this.bioErrors = [];
        this.otherFieldErrors = {};

        // Update shared firstName if available
        if (res.firstName || res.FirstName) {
          const newFirst = res.firstName ?? res.FirstName;
          this.authService.firstName.next(newFirst);
        }
        // If backend returned updated image path, update preview
        const profileImageUrl = res.profileImageUrl ?? res.profileImage ?? res.profileImagePath ?? null;
        if (profileImageUrl) {
          // apply a cache-busting query param so browser fetches the updated file immediately
          const busted = `${profileImageUrl}${profileImageUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;
          this.imagePreview = busted;
          try { this.authService.setProfileImage(busted); } catch {}
        }

        // if removal was requested, clear local flag
        if (this.removeImage) this.removeImage = false;
      },
      error: (err) => {
        console.error('Update failed', err);
        this.isLoading = false;
        // Surface status for debugging if available
        try { console.debug('Response status:', err?.status, 'body:', err?.error); } catch {}

        // Parse common ASP.NET Core validation shapes or plain message
        if (err?.error) {
          const serverErr = err.error;
          if (typeof serverErr === 'string') {
            this.errorMessage = serverErr;
          } else if (serverErr.message) {
            this.errorMessage = serverErr.message;
          } else if (serverErr.errors) {
            // errors is usually a dictionary of arrays - map to fields
            try {
              for (const [key, val] of Object.entries(serverErr.errors)) {
                const messages = (val as any[]).map((v) => String(v));
                const keyLower = key.toLowerCase();
                if (keyLower.includes('profile') || keyLower.includes('image')) {
                  this.fileErrors = messages;
                } else if (keyLower.includes('bio')) {
                  this.bioErrors = messages;
                } else {
                  this.otherFieldErrors[key] = messages;
                }
              }
              // set a generic message summarizing errors
              const all = Object.values(serverErr.errors).flat();
              this.errorMessage = all.join('; ');
            } catch (e) {
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
