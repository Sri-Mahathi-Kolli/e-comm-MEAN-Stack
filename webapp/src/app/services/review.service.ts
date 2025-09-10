import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Review {
  _id?: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: Date;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Array<{ _id: number; count: number }>;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Add a new review
  addReview(review: Partial<Review>): Observable<any> {
    return this.http.post(`${this.apiUrl}/reviews/add`, review);
  }

  // Get all reviews for a product (default limit of 3 for consistency)
  getProductReviews(productId: string, page: number = 1, limit: number = 3): Observable<any> {
    return this.http.get(`${this.apiUrl}/reviews/product/${productId}?page=${page}&limit=${limit}`);
  }

  // Get 3 random reviews for a product
  getRandomProductReviews(productId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/reviews/product/${productId}/random`);
  }

  // Mark review as helpful
  markReviewHelpful(reviewId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/reviews/${reviewId}/helpful`, {});
  }

  // Get review statistics for a product
  getReviewStats(productId: string): Observable<ReviewStats> {
    return this.http.get<ReviewStats>(`${this.apiUrl}/reviews/product/${productId}/stats`);
  }
}
