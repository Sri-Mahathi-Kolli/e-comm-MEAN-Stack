import { Component, inject } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import type { Product } from '../../types/product';
import type { Category } from '../../types/category';
import type { OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { RecentlyViewedService, RecentlyViewedItem } from '../../services/recently-viewed.service';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatIconModule, CarouselModule, CommonModule, ProductCardComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  scrollToCategory() {
    const el = document.querySelector('.cartzilla-category-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
  goToProduct(productId: string) {
    window.location.href = '/product/' + productId;
  }
  goToCategory(categoryId: string) {
    window.location.href = '/products?categoryId=' + categoryId;
  }
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    nav: true,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      900: { items: 4 }
    }
  };
  customerService = inject(CustomerService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  recentlyViewedService = inject(RecentlyViewedService);

  categories: Array<Category> = [];
  featuredProducts: Array<Product> = [];
  newProducts: Array<Product> = [];
  bannerImages: Array<Product> = [];
  recentlyViewedProducts: Array<RecentlyViewedItem> = [];

  // Shuffle function to randomize array order
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  ngOnInit() {
    this.customerService.getFeaturedProducts().subscribe((result: Product[]) => {
      this.featuredProducts = this.shuffleArray(result || []);
      this.bannerImages.push(...(result || []));
    });
    this.customerService.getNewProducts().subscribe((result: Product[]) => {
      this.newProducts = this.shuffleArray(result || []);
      this.bannerImages.push(...(result || []));
    });
    
    // Load recently viewed products
    this.recentlyViewedService.recentlyViewed$.subscribe((items) => {
      this.recentlyViewedProducts = items;
    });
    this.customerService.getCategories().subscribe((result: Category[]) => {
      this.categories = (result || []).map(category => ({
        ...category,
        image: this.getCategoryImage(category.name),
        relatedImages: this.getRelatedImages(category.name)
      }));
    });
  }

  private getRelatedImages(name: string): string[] {
    const related: { [key: string]: string[] } = {
      'Electronics': [
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=100&q=80',
        'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80'
      ],
      'Fashion': [
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=100&q=80',
        'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=100&q=80'
      ],
      'Beauty': [
        'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=100&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=100&q=80'
      ],
      'Home': [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=100&q=80',
        'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=100&q=80'
      ],
      'Sports': [
        'https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=100&q=80',
        'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80'
      ],
      'Mobiles': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=100&q=80',
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=100&q=80'
      ],
      // Add more categories as needed
    };
    return related[name] || [];
  }

  private getCategoryImage(name: string): string {
    const images: { [key: string]: string } = {
      'Electronics': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
      'Fashion': 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
      'Beauty': 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
      'Home': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      'Sports': 'https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=400&q=80',
      'Books': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
      'Toys': 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
      'Groceries': 'https://images.unsplash.com/photo-1464306076886-2550bca7a0b4?auto=format&fit=crop&w=400&q=80',
      'Jewelry': 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
      'Automotive': 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=400&q=80',
      'Health': 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=400&q=80',
      'Garden': 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
      'Music': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
      'Pets': 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80',
    };
    return images[name] || 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80';
  }
}