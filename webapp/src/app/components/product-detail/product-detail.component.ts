import { Component, inject } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../types/product';
import { MatButtonModule } from '@angular/material/button';
import { ProductCardComponent } from '../product-card/product-card.component';
import { WishlistService } from '../../services/wishlist.service';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { ReviewService, Review } from '../../services/review.service';
import { ReviewsComponent } from '../reviews/reviews.component';
import { SocialShareComponent } from '../social-share/social-share.component';
import { RecentlyViewedService } from '../../services/recently-viewed.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [MatButtonModule, ProductCardComponent, MatIconModule, ReviewsComponent, SocialShareComponent, FormsModule, CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  customerService = inject(CustomerService);
  reviewService = inject(ReviewService);
  recentlyViewedService = inject(RecentlyViewedService);
  route = inject(ActivatedRoute);

  product!: Product;
  mainImage!: string;
  similarProducts: Product[] = [];
  
  // Review form data
  newReview: Partial<Review> = {
    title: '',
    rating: 0,
    comment: ''
  };
  submittingReview = false;
  ngOnInit() {
    this.route.params.subscribe((x: any) => {
      this.getProductDetail(x.id);                         /////getting ids from the url
    })
  }

  getProductDetail(id: string) {
    this.customerService.getProductById(id).subscribe(result => {
      this.product = result;
      this.mainImage = this.product.images[0]?.toString() || '';
      console.log(this.product);
      
      // Track this product as recently viewed
      this.recentlyViewedService.trackProductView(id);
      
      this.customerService.getProducts('', this.product.categoryId, '', -1, '', 1, 10).subscribe(result => {
        this.similarProducts = result;
      })
    });
  }
  changeImage(url: string) {
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
    if (!this.isProductInCart(product._id!)) {
      this.cartService.addToCart(product._id!, 1).subscribe(() => {
        this.cartService.init();
      });
    } else {
      this.cartService.removeFromCart(product._id!).subscribe(() => {
        this.cartService.init();
      });

    }
  }
  isProductInCart(productId: String) {
    if (this.cartService.items.find((x) => x.product._id == productId)) {
      return true;
    } else {
      return false;
    }
  }

  // Submit a new review
  submitReview() {
    if (!this.product || !this.newReview.title || !this.newReview.rating || !this.newReview.comment) {
      return;
    }

    this.submittingReview = true;
    
    const reviewData: Partial<Review> = {
      productId: this.product._id?.toString(),
      title: this.newReview.title,
      rating: Number(this.newReview.rating),
      comment: this.newReview.comment
    };

    this.reviewService.addReview(reviewData).subscribe({
      next: (response) => {
        console.log('Review submitted successfully:', response);
        // Reset form
        this.newReview = {
          title: '',
          rating: 0,
          comment: ''
        };
        this.submittingReview = false;
        
        // Refresh reviews by triggering a reload of the reviews component
        // You could also emit an event or use a service to notify the reviews component
        window.location.reload(); // Simple approach, you can improve this
      },
      error: (error) => {
        console.error('Error submitting review:', error);
        this.submittingReview = false;
        // You could add a toast notification here
        alert('Error submitting review. Please try again.');
      }
    });
  }

}
