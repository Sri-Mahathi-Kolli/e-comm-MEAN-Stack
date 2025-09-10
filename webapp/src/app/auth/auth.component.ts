import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CategoryService } from '../services/category.service';
import { LoginToggleService } from '../services/login-toggle.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  isRegister = false;
  showLoginForm = false;
  showRegisterForm = false;
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private loginToggleService: LoginToggleService, private categoryService: CategoryService) {
    this.loginToggleService.signUp$.subscribe((signUp) => {
      this.togglePanel(signUp);
    });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required],
      question1: ['', Validators.required],
      answer1: ['', Validators.required],
      question2: ['', Validators.required],
      answer2: ['', Validators.required],
      question3: ['', Validators.required],
      answer3: ['', Validators.required]
    });
  }

  onForgotPassword() {
    this.router.navigate(['/forgot']);
  }

  togglePanel(register: boolean) {
    this.isRegister = register;
    this.showLoginForm = !register;
    this.showRegisterForm = register;
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(
        this.loginForm.value.email,
        this.loginForm.value.password
      ).subscribe({
        next: (result: any) => {
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
          this.categoryService.categoryRefresh$.next();
          this.router.navigateByUrl('/');
        },
        error: () => {
          alert('Login failed. Please check your credentials.');
        }
      });
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      const { password, confirmPassword } = this.registerForm.value;
      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }
      // Robust mapping for security questions
      const securityQuestions = [1, 2, 3].map(i => ({
        question: this.registerForm.value[`question${i}`],
        answer: this.registerForm.value[`answer${i}`]
      }));
      // Log payload for debugging
      console.log('Register payload:', {
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        email: this.registerForm.value.email,
        password,
        securityQuestions
      });
      this.authService.register(
        this.registerForm.value.firstName,
        this.registerForm.value.lastName,
        this.registerForm.value.email,
        password,
        securityQuestions
      ).subscribe({
        next: () => {
          alert('Account Created. Please log in.');
          this.togglePanel(false);
        },
        error: () => {
          alert('Registration failed. Please try again.');
        }
      });
    }
  }
}
