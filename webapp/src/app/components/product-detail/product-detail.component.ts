import { Component, inject, resource } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../types/product';
import { Brand } from '../../types/brand';
import { popResultSelector } from 'rxjs/internal/util/args';
import { MatButtonModule } from '@angular/material/button';
import { ProductCardComponent } from '../product-card/product-card.component';
import { WishlistService } from '../../services/wishlist.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  imports: [MatButtonModule, ProductCardComponent, MatIconModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  customerService = inject(CustomerService);
  route = inject(ActivatedRoute);
  product!: Product;
  mainImage!: String;
  similarProducts: Product[] = [];
  ngOnInit() {
    this.route.params.subscribe((x: any) => {
      this.getProductDetail(x.id);
    });

  }

  getProductDetail(id: String) {
    this.customerService.getProductById(id).subscribe(result => {
      this.product = result;
      this.mainImage = this.product.images[0];
      console.log(this.product);

      this.customerService.getProducts('', this.product.categoryId, '', -1, '', 1, 4).subscribe(result => {
        this.similarProducts = result;
      });
    });
  }
  changeImage(url: String) {
    this.mainImage = url;
  }

  get sellingPrice(): number {
    if (!this.product) return 0;

    const price = Number(this.product.Price);
    const discount = Number(this.product.discount);

    return Math.round(price - (price * discount) / 100);
  }

  wishlistService = inject(WishlistService);
  addToWishList(product: Product) {
    console.log(product);
    if (this.isInWishList(product)) {
      this.wishlistService.removeFromWishlists(product._id!).subscribe((result) => {
        this.wishlistService.init();
      });
    } else {
      this.wishlistService.addInWishlist(product._id!).subscribe((result) => {
        this.wishlistService.init();
      });
    }
  }

  isInWishList(product: Product) {
    let isExits = this.wishlistService.wishlists.find((x) => x._id == product._id);
    if (isExits) return true;
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
