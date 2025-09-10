import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CustomerService } from '../../services/customer.service';
import { Product } from '../../types/product';
import { Form, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { OrderService } from '../../services/order.service';
import { StripeService } from '../../services/stripe.service';
import { StripePaymentComponent } from '../stripe-payment/stripe-payment.component';
import { Order } from '../../types/order';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatRadioModule, FormsModule, StripePaymentComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent {

  cartServie = inject(CartService);
  stripeService = inject(StripeService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  
  // Stripe payment properties
  clientSecret: string = '';
  paymentIntentId: string = '';
  isProcessingPayment: boolean = false;

  ngOnInit() {
    this.cartServie.init();
    
    // Check if checkout parameter is present
    this.route.queryParams.subscribe(params => {
      if (params['checkout'] === 'true') {
        // Auto-start checkout process if user has items in cart
        setTimeout(() => {
          if (this.cartItems && this.cartItems.length > 0) {
            this.checkout();
          }
        }, 500); // Small delay to ensure cart items are loaded
      }
    });
  }
  get cartItems() {
    return this.cartServie.items;
  }

  sellingPrice(product: Product): number {
    if (!product) return 0;

    const price = Number(product.Price);
    const discount = Number(product.discount);

    return Math.round(price - (price * discount) / 100);
  }


  addToCart(productId: String, quantity: number) {
    this.cartServie.addToCart(productId, quantity).subscribe(result => {
      this.cartServie.init();
    })
  }
  get totalAmount() {
    let amount = 0;
    for (let index = 0; index < this.cartItems.length; index++) {
      const element = this.cartItems[index];
      amount += this.sellingPrice(element.product) * element.quantity;
    }

    return amount;
  }
  orderStep: number = 0;
  formbuilder = inject(FormBuilder);
  paymentType='cash';
  
  addressForm = this.formbuilder.group({
    address1: ['', Validators.required],
    address2: [''],
    city: ['', Validators.required],
    pincode: ['', Validators.required],
  });
  checkout() {
    this.orderStep = 1;
  }
  addAddress() {
    if (this.paymentType === 'card') {
      this.initializeStripePayment();
    } else {
      this.orderStep = 2;
    }
  }

  // Initialize Stripe payment
  initializeStripePayment() {
    this.isProcessingPayment = true;
    this.stripeService.createPaymentIntent(this.totalAmount).subscribe({
      next: (response) => {
        this.clientSecret = response.clientSecret;
        this.paymentIntentId = response.paymentIntentId;
        this.orderStep = 3; // Go to Stripe payment step
        this.isProcessingPayment = false;
      },
      error: (error) => {
        console.error('Error creating payment intent:', error);
        alert('Failed to initialize payment. Please try again.');
        this.isProcessingPayment = false;
      }
    });
  }

  // Handle successful Stripe payment
  onStripePaymentSuccess(paymentIntent: any) {
    const order: Order = {
      items: this.cartItems,
      paymentType: 'card',
      address: this.addressForm.value,
      date: new Date(),
    };

    this.stripeService.processOrder(order, this.paymentIntentId).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Payment successful! Your order has been placed.');
          this.cartServie.init();
          this.orderStep = 0;
          this.router.navigateByUrl('orders');
        } else {
          alert('Order processing failed. Please contact support.');
        }
      },
      error: (error) => {
        console.error('Error processing order:', error);
        alert('Order processing failed. Please contact support.');
      }
    });
  }

  // Handle Stripe payment error
  onStripePaymentError(error: string) {
    alert('Payment failed: ' + error);
  }

  // Handle Stripe payment cancellation
  onStripePaymentCancel() {
    this.orderStep = 2; // Go back to payment selection
  }

  orderService=inject(OrderService);
  completeOrder(){
    let order:Order={
      items:this.cartItems,
      paymentType:this.paymentType,
      address:this.addressForm.value,
      date:new Date(),
      
    };
    const result = window.confirm("Are you sure you want to proceed?");
    if(result){
      this.orderService.addOrder(order).subscribe((result)=>{
      alert("Your order is completed");
      this.cartServie.init();
      this.orderStep=0;
      this.router.navigateByUrl('orders');
    })
    }else{
      this.router.navigateByUrl('orders')
    }
    console.log(order);
  }
}
