import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent {
  oldPassword: string = '';
  newPassword: string = '';
  retypeNewPassword: string = '';

  changePassword(event: Event) {
    event.preventDefault();
    if (!this.oldPassword || !this.newPassword || !this.retypeNewPassword) {
      alert('Please fill all password fields.');
      return;
    }
    if (this.newPassword !== this.retypeNewPassword) {
      alert('New passwords do not match.');
      return;
    }
    this.http.put(environment.apiUrl + '/profile/change-password', {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    }, { withCredentials: true }).subscribe({
      next: (res: any) => {
        alert(res.message || 'Password changed successfully!');
        this.oldPassword = '';
        this.newPassword = '';
        this.retypeNewPassword = '';
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to change password.');
      }
    });
  }
  router = inject(Router);
  authService = inject(AuthService);
  http = inject(HttpClient);

  user: any;

  constructor() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      this.user = {
        name: this.authService?.userName || 'Your Name',
        location: 'Your Location',
        firstName: '',
        lastName: '',
        company: '',
        street: '',
        zip: '',
        state: '',
        country: '',
        telephone: '',
        email: this.authService?.userEmail || '',
        profileImage: ''
      };
    }
  }

  saving = false;
  selectedImage: File | null = null;

  // Helper method to get full image URL
  getProfileImageUrl(): string {
    if (!this.user.profileImage) {
      return 'assets/profile-placeholder.png';
    }
    
    if (this.user.profileImage.startsWith('/uploads')) {
      return environment.apiUrl + this.user.profileImage;
    }
    
    return this.user.profileImage;
  }

  // Sidebar navigation actions
  goToOrders() {
    this.router.navigate(['/orders']);
  }

  showProfile() {
    document.querySelector('.profile-details')?.scrollIntoView({ behavior: 'smooth' });
  }

  goToAddresses() {
    document.querySelector('.profile-addresses')?.scrollIntoView({ behavior: 'smooth' });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // -------- Profile Save --------
  saveProfile() {
    this.saving = true;
    this.authService.updateProfile(this.user).subscribe({
      next: (updatedUser: any) => {
        this.user = {
          ...this.user,
          ...updatedUser
        };
        this.saving = false;
        alert('Profile updated successfully!');
      },
      error: () => {
        this.saving = false;
        alert('Failed to update profile.');
      }
    });
  }

  // -------- Image Upload --------
  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('File too large! Max 2MB.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Invalid file type. Please upload an image.');
        return;
      }
      this.selectedImage = file;
    }
  }

  uploadImage(event: Event) {
    event.preventDefault();
    if (!this.selectedImage) return;

    const formData = new FormData();
    formData.append('profileImage', this.selectedImage);

    this.http.put(environment.apiUrl + '/profile', formData, { withCredentials: true }).subscribe({
      next: (res: any) => {
        alert('Image uploaded successfully!');
        if (res.profileImage) {
          this.user.profileImage = res.profileImage; // update preview
          // Update localStorage user object
          let userData = localStorage.getItem('user');
          if (userData) {
            let userObj = JSON.parse(userData);
            userObj.profileImage = res.profileImage;
            localStorage.setItem('user', JSON.stringify(userObj));
          }
        }
        this.selectedImage = null;
      },
      error: () => {
        alert('Image upload failed.');
      }
    });
  }
}
