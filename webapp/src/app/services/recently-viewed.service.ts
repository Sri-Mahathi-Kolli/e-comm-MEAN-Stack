import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product } from '../types/product';
import { environment } from '../../environments/environment';

export interface RecentlyViewedItem {
  _id: string;
  viewedAt: Date;
  product: Product;
}

@Injectable({
  providedIn: 'root'
})
export class RecentlyViewedService {
  private apiUrl = `${environment.apiUrl}/api/recently-viewed`;
  private recentlyViewedSubject = new BehaviorSubject<RecentlyViewedItem[]>([]);
  public recentlyViewed$ = this.recentlyViewedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadRecentlyViewed();
  }

  // Add product to recently viewed
  addProduct(productId: string): Observable<any> {
    const userId = this.getUserId();
    if (!userId) return new Observable(observer => observer.error('User not logged in'));

    return this.http.post(this.apiUrl, { userId, productId });
  }

  // Get recently viewed products
  getRecentlyViewed(limit: number = 10): Observable<RecentlyViewedItem[]> {
    const userId = this.getUserId();
    if (!userId) return new Observable(observer => observer.next([]));

    return this.http.get<RecentlyViewedItem[]>(`${this.apiUrl}/${userId}?limit=${limit}`);
  }

  // Load recently viewed and update subject
  loadRecentlyViewed(): void {
    this.getRecentlyViewed().subscribe({
      next: (items) => {
        this.recentlyViewedSubject.next(items);
      },
      error: (error) => {
        console.error('Error loading recently viewed:', error);
        this.recentlyViewedSubject.next([]);
      }
    });
  }

  // Clear all recently viewed
  clearHistory(): Observable<any> {
    const userId = this.getUserId();
    if (!userId) return new Observable(observer => observer.error('User not logged in'));

    return this.http.delete(`${this.apiUrl}/${userId}`);
  }

  // Remove specific product
  removeProduct(productId: string): Observable<any> {
    const userId = this.getUserId();
    if (!userId) return new Observable(observer => observer.error('User not logged in'));

    return this.http.delete(`${this.apiUrl}/${userId}/${productId}`);
  }

  // Track product view (call this when user visits product detail)
  trackProductView(productId: string): void {
    this.addProduct(productId).subscribe({
      next: () => {
        // Refresh the recently viewed list
        this.loadRecentlyViewed();
      },
      error: (error) => {
        console.error('Error tracking product view:', error);
      }
    });
  }

  // Get current recently viewed items
  get currentItems(): RecentlyViewedItem[] {
    return this.recentlyViewedSubject.value;
  }

  // Helper method to get user ID from local storage or auth service
  private getUserId(): string | null {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        return userData._id || userData.id;
      }
      return null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  }
}
