import { HttpBackend, HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../types/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor() { }

  http = inject(HttpClient);

  wishlists: Product[] = [];
  init() {
    return this.getWishlists().subscribe((result) => {
      this.wishlists = result;
    });
  }
  getWishlists() {
    return this.http.get<Product[]>(environment.apiUrl + '/customer/wishlists');
  }
  addInWishlist(productId:String) {
    return this.http.post(environment.apiUrl + '/customer/wishlists/'+productId,
      {});
  }
  removeFromWishlists(productId:String) {
    return this.http.delete(environment.apiUrl + '/customer/wishlists/'+productId);
  }
}
