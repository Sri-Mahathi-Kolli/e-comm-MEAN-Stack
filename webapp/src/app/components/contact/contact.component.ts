import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  imports: [CommonModule, ReactiveFormsModule],
})
export class ContactComponent {
  contactForm: FormGroup;
  submitting = false;
  successMsg = '';
  errorMsg = '';

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  submitContact() {
    this.successMsg = '';
    this.errorMsg = '';
    if (this.contactForm.invalid) return;
    this.submitting = true;
    this.contactService.submitContact(this.contactForm.value).subscribe({
      next: (res) => {
        this.successMsg = res.message || 'Message sent successfully!';
        this.contactForm.reset();
        this.submitting = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.error || 'Failed to send message.';
        this.submitting = false;
      },
    });
  }
}
