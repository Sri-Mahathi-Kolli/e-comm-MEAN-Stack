import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent {
  step = 1;
  forgotForm: FormGroup;
  questionForm: FormGroup;
  selectedQuestion: string = '';
  message: string = '';
  showSuccessPopup = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.questionForm = this.fb.group({
      answer: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onEmailSubmit() {
    console.log('Forgot password form submitted:', this.forgotForm.value);
    if (this.forgotForm.valid) {
      this.authService.getSecurityQuestions(this.forgotForm.value.email).subscribe({
        next: (res: any) => {
          console.log('Security questions API response:', res);
          const questions = res.questions;
          if (questions.length === 3) {
            // Randomly select one question
            const randomIndex = Math.floor(Math.random() * 3);
            this.selectedQuestion = questions[randomIndex];
            this.step = 2;
            this.message = '';
          } else {
            this.message = 'Security questions not set for this user.';
          }
        },
        error: (err) => {
          console.error('Security questions API error:', err);
          this.message = 'User not found or no security questions.';
        }
      });
    } else {
      console.warn('Forgot password form is invalid:', this.forgotForm);
    }
  }

  onQuestionSubmit() {
    if (this.questionForm.valid) {
      this.authService.verifySecurityAnswer(
        this.forgotForm.value.email,
        this.selectedQuestion,
        this.questionForm.value.answer,
        this.questionForm.value.newPassword
      ).subscribe({
        next: (res: any) => {
          window.alert('Password reset is successful');
          this.router.navigate(['/login']);
          this.step = 1;
          this.forgotForm.reset();
          this.questionForm.reset();
        },
        error: (err: any) => {
          this.message = err.error?.error || 'Security answer incorrect.';
        }
      });
    }
  }

  // Removed popup and redirect, now using window.alert
}
