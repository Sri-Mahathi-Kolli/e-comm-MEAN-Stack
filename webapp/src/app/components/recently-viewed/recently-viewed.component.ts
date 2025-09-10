import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { RecentlyViewedService, RecentlyViewedItem } from '../../services/recently-viewed.service';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-recently-viewed',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ProductCardComponent
  ],
  templateUrl: './recently-viewed.component.html',
  styleUrls: ['./recently-viewed.component.scss']
})
export class RecentlyViewedComponent implements OnInit {
  recentlyViewedService = inject(RecentlyViewedService);
  router = inject(Router);
  
  recentlyViewed: RecentlyViewedItem[] = [];
  isLoading = false;

  ngOnInit() {
    this.loadRecentlyViewed();
  }

  loadRecentlyViewed() {
    this.isLoading = true;
    this.recentlyViewedService.recentlyViewed$.subscribe({
      next: (items) => {
        this.recentlyViewed = items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading recently viewed:', error);
        this.isLoading = false;
      }
    });
  }

  removeItem(productId: string) {
    this.recentlyViewedService.removeProduct(productId).subscribe({
      next: () => {
        this.recentlyViewedService.loadRecentlyViewed();
      },
      error: (error) => {
        console.error('Error removing item:', error);
      }
    });
  }

  clearAll() {
    this.recentlyViewedService.clearHistory().subscribe({
      next: () => {
        this.recentlyViewedService.loadRecentlyViewed();
      },
      error: (error) => {
        console.error('Error clearing history:', error);
      }
    });
  }

  goToProduct(productId: string) {
    this.router.navigate(['/product', productId]);
  }
}
