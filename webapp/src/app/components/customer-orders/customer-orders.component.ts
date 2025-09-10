import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../../types/order';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../types/product';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-customer-orders',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './customer-orders.component.html',
  styleUrl: './customer-orders.component.scss'
})
export class CustomerOrdersComponent {
  router = inject(Router);
  // ...existing code...
  openProduct(productId: string) {
    if (productId) {
      this.router.navigate(['/product', productId]);
    }
  }
  // ...existing code...
  orders:Order[]=[];
  orderService=inject(OrderService);
  cartService=inject(CartService);
  reorder(order: Order) {
    if (!order.items || order.items.length === 0) {
      alert('No items to reorder.');
      return;
    }
    let addedCount = 0;
    const totalItems = order.items.length;
    order.items.forEach(item => {
      const productId = item.product?._id;
      const quantity = item.quantity;
      if (typeof productId === 'string') {
        this.cartService.addToCart(productId, quantity).subscribe({
          next: () => {
            addedCount++;
            if (addedCount === totalItems) {
              this.router.navigateByUrl('/cart');
            }
          },
          error: () => {
            alert('Failed to add item to cart.');
          }
        });
      }
    });
  }

  ngOnInit(){
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getCustomerOrders().subscribe((result)=>{
      this.orders=result;
      console.log(this.orders);
    });
  }

  sellingPrice(product: Product): number {
      if (!product) return 0;
  
      const price = Number(product.Price);
      const discount = Number(product.discount);
  
      return Math.round(price - (price * discount) / 100);
    }

  canCancelOrder(order: Order): boolean {
    // Customer can only cancel orders that are still in progress/processing
    const status = order.status?.toString().toLowerCase();
    return status === 'processing' || status === 'inprogress';
  }

  cancelOrder(order: Order) {
    if (!order._id) return;

    if (confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      const reason = prompt('Please provide a reason for cancellation:', 'Changed my mind');
      if (reason === null || reason.trim() === '') {
        alert('Cancellation reason is required.');
        return;
      }
  this.orderService.cancelOrder(order._id as string, reason).subscribe({
        next: (response) => {
          console.log('Order cancelled successfully:', response);
          alert('Order cancelled successfully!');
          // Reload orders to show updated status
          this.loadOrders();
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          let errorMessage = 'Failed to cancel order. Please try again.';

          if (error.error?.error) {
            errorMessage = error.error.error;
          } else if (error.status === 400) {
            errorMessage = 'This order cannot be cancelled (may already be shipped or delivered).';
          } else if (error.status === 403) {
            errorMessage = 'You do not have permission to cancel this order.';
          } else if (error.status === 404) {
            errorMessage = 'Order not found.';
          }

          alert(errorMessage);
        }
      });
    }
  }
}
