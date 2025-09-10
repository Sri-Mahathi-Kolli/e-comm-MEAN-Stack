import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent {
  oldPassword: string = '';
  newPassword: string = '';
  retypeNewPassword: string = '';
  user: any = {
    firstName: '',
    lastName: '',
    company: '',
    street: '',
    zip: '',
    state: '',
    country: '',
    telephone: '',
    email: '',
    profileImage: ''
  };
      scrollToProfileDetails(event?: Event) {
        if (event) event.preventDefault();
        const el = document.getElementById('profile-details-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    // ...existing code...

    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  get displayName() {
    return `${this.user?.firstName || ''} ${this.user?.lastName || ''}`.trim();
  }

  selectedImage: File | null = null;
  showImageModal: boolean = false;

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {}
  goToOrders(event?: Event) {
    if (event) event.preventDefault();
    this.router.navigate(['/orders']);
  }

  ngOnInit() {
    // Try to populate from localStorage first
    const userData = localStorage.getItem('user');
    if (userData) {
      const userObj = JSON.parse(userData);
      this.user = { ...this.user, ...userObj };
      if (userObj.profileImage) {
        this.user.profileImage = userObj.profileImage.startsWith('http') ? userObj.profileImage : environment.apiUrl + userObj.profileImage;
      }
    }
    // Always fetch latest from backend and update localStorage
    this.authService.getProfile().subscribe({
      next: (res: any) => {
        this.user = { ...this.user, ...res };
        if (res.profileImage) {
          this.user.profileImage = res.profileImage.startsWith('http') ? res.profileImage : environment.apiUrl + res.profileImage;
        }
        localStorage.setItem('user', JSON.stringify(this.user));
      },
      error: () => {
        // Optionally handle error (e.g., show message, clear user)
      }
    });
  }

  openImageModal() {
    this.showImageModal = true;
  }

  closeImageModal() {
    this.showImageModal = false;
    this.selectedImage = null;
  }

  onImageSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedImage = event.target.files[0];
    }
  }

  uploadImage(event: Event) {
    event.preventDefault();
    if (!this.selectedImage) return;

    const formData = new FormData();
    for (const key in this.user) {
      if (key !== 'profileImage' && key !== 'securityQuestions') {
        formData.append(key, this.user[key]);
      }
    }
    // Ensure securityQuestions is sent as a JSON string
    if (this.user.securityQuestions) {
      formData.append('securityQuestions', JSON.stringify(this.user.securityQuestions));
    }
    formData.append('profileImage', this.selectedImage);

    this.authService.updateProfile(formData).subscribe((res: any) => {
      if (res.profileImage) {
        this.user.profileImage = res.profileImage.startsWith('http') ? res.profileImage : environment.apiUrl + res.profileImage;
      }
      this.closeImageModal();
    });
  }

  saveProfile(event: Event) {
    event.preventDefault();
    this.authService.updateProfile(this.user).subscribe({
      next: (res: any) => {
        // Update local user object and localStorage
        this.user = { ...this.user, ...res };
        if (res.profileImage) {
          this.user.profileImage = res.profileImage.startsWith('http') ? res.profileImage : environment.apiUrl + res.profileImage;
        }
        localStorage.setItem('user', JSON.stringify(this.user));
        alert('Profile changes are updated');
      },
      error: () => {
        alert('Failed to update profile');
      }
    });
  }

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
    this.authService.changePassword(this.oldPassword, this.newPassword).subscribe({
      next: (res: any) => {
        alert(res.message || 'Password changed successfully.');
        this.oldPassword = '';
        this.newPassword = '';
        this.retypeNewPassword = '';
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to change password.');
      }
    });
  }
}
