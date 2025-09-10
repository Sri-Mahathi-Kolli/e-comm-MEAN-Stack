import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StripeService } from '../../services/stripe.service';
import { StripeCardElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-stripe-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.scss']
})
export class StripePaymentComponent implements OnInit, OnDestroy {
  @ViewChild('cardElement', { static: true }) cardElementRef!: ElementRef;
  @Input() amount: number = 0;
  @Input() clientSecret: string = '';
  @Output() paymentSuccess = new EventEmitter<any>();
  @Output() paymentError = new EventEmitter<string>();
  @Output() paymentCancel = new EventEmitter<void>();

  private cardElement: StripeCardElement | null = null;
  processing = false;
  errorMessage = '';

  constructor(private stripeService: StripeService) {}

  ngOnInit() {
    this.initializeCard();
  }

  ngOnDestroy() {
    if (this.cardElement) {
      this.cardElement.destroy();
    }
  }

  private async initializeCard() {
    const elements = this.stripeService.createElements();
    if (elements) {
      this.cardElement = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            fontFamily: 'Arial, sans-serif',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
          invalid: {
            color: '#9e2146',
          },
        },
        hidePostalCode: false, // This will include the ZIP/postal code field
      });

      this.cardElement.mount(this.cardElementRef.nativeElement);
      
      this.cardElement.on('change', (event: any) => {
        if (event.error) {
          this.errorMessage = event.error.message || '';
        } else {
          this.errorMessage = '';
        }
      });
    }
  }

  async processPayment() {
    if (!this.cardElement || !this.clientSecret) {
      this.errorMessage = 'Payment setup incomplete';
      return;
    }

    this.processing = true;
    this.errorMessage = '';

    try {
      console.log('Processing payment with client secret:', this.clientSecret);
      const result = await this.stripeService.confirmPayment(this.clientSecret, this.cardElement);
      console.log('Payment confirmation result:', result);
      
      if (result.error) {
        console.error('Payment error:', result.error);
        this.errorMessage = result.error.message || 'Payment failed';
        this.paymentError.emit(this.errorMessage);
      } else {
        console.log('Payment successful:', result.paymentIntent);
        this.paymentSuccess.emit(result.paymentIntent);
      }
    } catch (error) {
      console.error('Payment processing exception:', error);
      this.errorMessage = 'Payment processing failed';
      this.paymentError.emit(this.errorMessage);
    } finally {
      this.processing = false;
    }
  }

  cancelPayment() {
    this.paymentCancel.emit();
  }
}
