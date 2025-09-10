import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;

  constructor(private http: HttpClient) {
    this.initializeStripe();
  }

  private async initializeStripe() {
    this.stripe = await loadStripe(environment.stripePublishableKey);
  }

  getStripe(): Stripe | null {
    return this.stripe;
  }

  createElements() {
    if (this.stripe) {
      this.elements = this.stripe.elements();
      return this.elements;
    }
    return null;
  }

  getElements(): StripeElements | null {
    return this.elements;
  }

  createPaymentIntent(amount: number): Observable<any> {
    return this.http.post(environment.apiUrl + '/payment/create-payment-intent', 
      { amount }
    );
  }

  processOrder(order: any, paymentIntentId: string): Observable<any> {
    return this.http.post(environment.apiUrl + '/payment/process-order', 
      { order, paymentIntentId }
    );
  }

  createCheckoutSession(items: any[], successUrl: string, cancelUrl: string): Observable<any> {
    return this.http.post(environment.apiUrl + '/payment/create-checkout-session', 
      { items, successUrl, cancelUrl }
    );
  }

  async confirmPayment(clientSecret: string, cardElement: StripeCardElement) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    return await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      }
    });
  }
}
