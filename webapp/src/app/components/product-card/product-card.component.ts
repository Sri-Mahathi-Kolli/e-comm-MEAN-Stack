import { Component, inject, Input } from '@angular/core';
import { Product } from '../../types/product';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  imports: [MatButtonModule, RouterLink, MatIconModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
@Input() product!:Product;
wishlistService = inject(WishlistService);
get sellingPrice(): Number {
    if (!this.product) return 0;

    const price = Number(this.product.Price);
    const discount = Number(this.product.discount);

    return Math.round(price - (price * discount) / 100);
  }

addToWishList(product: Product) {
  console.log(product);
  if(this.isInWishList(product)){
    this.wishlistService.removeFromWishlists(product._id!).subscribe((result) => {
      this.wishlistService.init();
    });
  }else {
    this.wishlistService.addInWishlist(product._id!).subscribe((result) => {
      this.wishlistService.init();
    });
  }
}

isInWishList(product: Product){
  let isExits = this.wishlistService.wishlists.find( (x) => x._id == product._id);
  if(isExits) return true;
  else return false;
}
cartService = inject(CartService);
addToCart(product: Product){
  console.log(product);
  if(!this.isProductInCart(product._id!)){
    this.cartService.addToCart(product._id!, 1).subscribe(() => {
      this.cartService.init();
    });
  }else {
    this.cartService.removeFromCart(product._id!).subscribe(() => {
      this.cartService.init();
    });
  }
}
isProductInCart(productId:String) {
  if(this.cartService.items.find((x)=>x.product._id == productId)){
    return true;
  }else {
    return false;
  }
}
}
