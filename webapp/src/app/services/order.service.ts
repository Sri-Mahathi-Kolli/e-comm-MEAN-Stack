import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Order } from '../types/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor() { }

  http=inject(HttpClient);



  addOrder(order:Order){

    return this.http.post(environment.apiUrl+'/customer/order',order);
  }
  getCustomerOrders(){
    return this.http.get<Order[]>(environment.apiUrl+'/customer/orders');

  }
  getAdminOrder(){
    return this.http.get<Order[]>(environment.apiUrl+'/orders');
  }
  updateOrderStatus(id:String,status:String){
    return this.http.post(environment.apiUrl+'/orders/'+id,{
      status:status,
    });
  }

  cancelOrder(orderId: string, reason: string) {
    return this.http.post(environment.apiUrl + '/customer/orders/' + orderId + '/cancel', { reason: reason });
  }

  adminCancelOrder(orderId: String, reason: String) {
    return this.http.post(environment.apiUrl+'/orders/'+orderId+'/cancel', {
      reason: reason
    });
  }
}
