import { Component, inject, Input } from '@angular/core';
import { Product } from '../../types/product';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { SocialShareComponent } from '../social-share/social-share.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, SocialShareComponent],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  wishlistService = inject(WishlistService);
  router = inject(Router);
  goToProduct(productId: string) {
    console.log('Clicked', productId);
    if (productId) {
      this.router.navigate(['/product', productId]);
    } else {
      console.warn('Product id is missing, navigation aborted.');
    }
  }
  get sellingPrice(): number {
    if (!this.product) return 0;

    const price = Number(this.product.Price);
    const discount = Number(this.product.discount);

    return Math.round(price - (price * discount) / 100);
  }


  addToWishList(product: Product) {
    console.log(product);
    if (this.isInWishlist(product)) {
      this.wishlistService.removeFromWishlists(product._id!).subscribe((result) => {
        this.wishlistService.init();
      });
    } else {
      this.wishlistService.addInWishlist(product._id!).subscribe((result) => {
        this.wishlistService.init();
      });

    }

  }
  isInWishlist(product: Product) {
    let isExits = this.wishlistService.wishlists.find((x) => x._id == product._id);
    if (isExits) return true; else return false;
  }
  cartService = inject(CartService);
  addToCart(product: Product) {
    console.log(product);
    if (!this.isProductInCart(String(product._id))) {
      this.cartService.addToCart(String(product._id), 1).subscribe(() => {
        this.cartService.init();
      });
    } else {
      this.cartService.removeFromCart(String(product._id)).subscribe(() => {
        this.cartService.init();
      });
    }
  }

  isProductInCart(productId: string): boolean {
    return !!this.cartService.items.find((x: any) => x.product && String(x.product._id) === productId);
  }
}
