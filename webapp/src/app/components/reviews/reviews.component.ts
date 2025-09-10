import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ReviewService, Review } from '../../services/review.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, MatChipsModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class ReviewsComponent implements OnInit {
  @Input() productId!: string;
  
  reviewService = inject(ReviewService);
  reviews: Review[] = [];
  loading = true;

  ngOnInit() {
    if (this.productId && this.productId.trim() !== '') {
      this.loadRandomReviews();
    } else {
      this.loading = false;
    }
  }

  loadRandomReviews() {
    this.loading = true;
    this.reviewService.getRandomProductReviews(this.productId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.loading = false;
      }
    });
  }

  getStarArray(rating: number): number[] {
    return Array.from({length: 5}, (_, i) => i + 1);
  }

  markHelpful(reviewId: string) {
    this.reviewService.markReviewHelpful(reviewId).subscribe({
      next: () => {
        // Find and update the review locally
        const review = this.reviews.find(r => r._id === reviewId);
        if (review) {
          review.helpful = (review.helpful || 0) + 1;
        }
      },
      error: (error) => {
        console.error('Error marking review as helpful:', error);
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  trackByReviewId(index: number, review: Review): string {
    return review._id || index.toString();
  }
}
