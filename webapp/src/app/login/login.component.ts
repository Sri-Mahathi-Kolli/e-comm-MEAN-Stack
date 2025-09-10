import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { LoginToggleService } from '../services/login-toggle.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None   // 👈 important to apply global CSS
})
export class LoginComponent implements OnInit {
  isSignUp = false;
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginToggleService: LoginToggleService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loginToggleService.signUp$.subscribe((signUp) => {
      this.isSignUp = signUp;
    });
    this.checkSignUpFlag();
  }

  checkSignUpFlag() {
    const showSignUp = localStorage.getItem('showSignUp');
    this.isSignUp = showSignUp === 'true';
    localStorage.removeItem('showSignUp');
  }

  togglePanel(signUp: boolean) {
    this.isSignUp = signUp;
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log('Login Data:', this.loginForm.value);
      alert('Login successful!');
    }
  }

  onForgotPassword() {
    this.router.navigateByUrl('/forgot');
  }

  onRegister() {
    if (this.registerForm.valid) {
      const { password, confirmPassword } = this.registerForm.value;
      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }
      console.log('Register Data:', this.registerForm.value);
      alert('Account Created. Please go back to Login');
      this.togglePanel(false);
    }
  }
}
