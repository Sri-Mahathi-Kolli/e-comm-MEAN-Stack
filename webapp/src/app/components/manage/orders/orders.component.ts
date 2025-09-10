import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../types/order';
import { DatePipe, CommonModule } from '@angular/common';
import { Product } from '../../../types/product';
import { MatButtonModule } from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-orders',
  imports: [DatePipe, MatButtonModule, MatButtonToggleModule, MatIconModule, CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  orderService=inject(OrderService);
  cdr = inject(ChangeDetectorRef);
  orders:Order[]=[];
  
  ngOnInit(){
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAdminOrder().subscribe((result)=>{
      this.orders=result;
    })
  }

  sellingPrice(product: Product): number {
        if (!product) return 0;
    
        const price = Number(product.Price);
        const discount = Number(product.discount);
    
        return Math.round(price - (price * discount) / 100);
      }

  statusChanged(button:any,order:Order){
    console.log('Status changing to:', button.value);
    console.log('Order before update:', order);
    
    this.orderService.updateOrderStatus(order._id!,button.value).subscribe({
      next: (result) => {
        console.log('Server response:', result);
        
        // Find the order in the array and update it completely
        const orderIndex = this.orders.findIndex(o => o._id === order._id);
        if (orderIndex !== -1) {
          // Create a completely new order object to ensure change detection
          this.orders[orderIndex] = {
            ...this.orders[orderIndex],
            status: button.value
          };
          
          console.log('Updated order status in array:', this.orders[orderIndex].status);
          
          // Force change detection by creating a new array reference
          this.orders = [...this.orders];
          
          // Manually trigger change detection
          this.cdr.detectChanges();
          
          // Also update the original order reference for immediate UI response
          order.status = button.value;
          
          console.log('Order after update:', order);
          console.log('Orders array after update:', this.orders.map(o => ({ id: o._id, status: o.status })));
        }
        
        alert("Order Status Updated");
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        alert("Error updating order status. Please try again.");
      }
    })
  }

  canCancelOrder(order: Order): boolean {
  // Admin can cancel orders that are not delivered or already cancelled
  const status = order.status?.toLowerCase();
  return status !== 'delivered' && status !== 'cancelled';
  }

  getStatusColorClass(status: String | undefined): string {
    const statusStr = status?.toString();
    switch (statusStr) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'Processing':
      case 'inprogress':
      case 'Dispatched':
        return 'bg-yellow-100 text-yellow-700';
      case 'Shipped':
        return 'bg-blue-100 text-blue-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  cancelOrder(order: Order) {
    if (!order._id) return;
    
    const reasons = [
      'Product not available',
      'Product out of stock', 
      'Unable to fulfill order',
      'Quality control issue',
      'Shipping not possible to location',
      'Other'
    ];

    const reason = prompt(
      'Please select a reason for cancellation:\n\n' +
      reasons.map((r, i) => `${i + 1}. ${r}`).join('\n') + 
      '\n\nEnter the number (1-6) or custom reason:'
    );

    if (!reason) return; // User cancelled

    let cancellationReason = reason;
    const reasonNumber = parseInt(reason);
    if (reasonNumber >= 1 && reasonNumber <= reasons.length) {
      cancellationReason = reasons[reasonNumber - 1];
    }

    if (confirm(`Are you sure you want to cancel this order?\nReason: ${cancellationReason}\n\nThe customer will be notified.`)) {
      this.orderService.adminCancelOrder(order._id, cancellationReason).subscribe({
        next: (response) => {
          console.log('Order cancelled successfully:', response);
          alert('Order cancelled successfully! Customer will be notified.');
          this.loadOrders(); // Reload to show updated status
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          let errorMessage = 'Failed to cancel order. Please try again.';
          
          if (error.error?.error) {
            errorMessage = error.error.error;
          } else if (error.status === 400) {
            errorMessage = 'This order cannot be cancelled (may already be delivered).';
          }
          
          alert(errorMessage);
        }
      });
    }
  }
}
