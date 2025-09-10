import { Component, Input } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart-drawer',
  templateUrl: './cart-drawer.component.html',
  styleUrls: ['./cart-drawer.component.scss'],
  imports: [CommonModule, MatIconModule, MatSidenavModule, FormsModule]
})
export class CartDrawerComponent {
  openProduct(productId: string) {
    this.closeDrawer();
    this.router.navigate(['/product', productId]);
  }
  @Input() opened: boolean = false;
  @Output() openedChange = new EventEmitter<boolean>();

  constructor(public cartService: CartService, private router: Router) {}

  closeDrawer() {
    this.opened = false;
    this.openedChange.emit(false);
  }

  continueShopping() {
    this.closeDrawer();
    this.router.navigateByUrl('/products'); // or '/' for home
  }

  viewCart() {
    this.closeDrawer();
    this.router.navigateByUrl('/cart');
  }

  checkout() {
    this.closeDrawer();
    this.router.navigateByUrl('/cart'); // or '/checkout' if you have a separate route
  }

  removeFromCart(productId: string) {
    this.cartService.removeFromCart(productId).subscribe(() => {
      this.cartService.init();
    });
  }

  getSubtotal() {
    return this.cartService.items.reduce((sum, item) => sum + (Number(item.product.Price) * item.quantity), 0);
  }
}
