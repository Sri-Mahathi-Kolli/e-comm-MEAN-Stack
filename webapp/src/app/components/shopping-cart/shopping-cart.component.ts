import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from '../../types/product';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { OrderService } from '../../services/order.service';
import { Order } from '../../types/order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatRadioModule, FormsModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {
  cartService = inject(CartService);
  ngOnInit() {
    this.cartService.init();
  }
  get cartItems() {
    return this.cartService.items;
  }

  sellingPrice(product: Product): number {
    if (!product) return 0;

    const price = Number(product.Price);
    const discount = Number(product.discount);

    return Math.round(price - (price * discount) / 100);
  }

  addToCart(productId: String, quantity: number) {
    this.cartService.addToCart(productId, quantity).subscribe(result => {
      this.cartService.init();
    })
  }

  get totalAmount() {
    let amount = 0;
    for (let index = 0; index < this.cartItems.length; index++) {
      const element = this.cartItems[index];
      amount += this.sellingPrice(element.product) * element.quantity
    }
    return amount;
  }

  orderStep: number = 0;
  formbuilder = inject(FormBuilder);
  paymentType = 'cash';
  addressForm = this.formbuilder.group({
    address1: [''],
    address2: [''],
    city: [''],
    pincode: [''],
  })

  checkout() {
    this.orderStep = 1;
  }

  addAddress() {
    this.orderStep = 2;
  }

  orderService = inject(OrderService);
  router = inject(Router);
  completeOrder() {
    let order: Order = {
      items: this.cartItems,
      paymentType: this.paymentType,
      address: this.addressForm.value,
      date: new Date()
    };
    this.orderService.addOrder(order).subscribe(result => {
      alert("Your Order is Completed");
      this.cartService.init();
      this.orderStep = 0;
      this.router.navigateByUrl("/orders");
    });
  }
}
