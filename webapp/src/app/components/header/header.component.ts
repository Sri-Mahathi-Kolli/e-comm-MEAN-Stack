import { Component, inject } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../types/category';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginToggleService } from '../../services/login-toggle.service';
import { CustomerService } from '../../services/customer.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { CartDrawerService } from '../../services/cart-drawer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CartDrawerComponent } from '../cart-drawer/cart-drawer.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink,
    FormsModule,MatIconModule,CommonModule,CartDrawerComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  loginToggleService = inject(LoginToggleService);
  // ...existing code...
  openLogin(signUp: boolean) {
    this.loginToggleService.toggle(signUp);
    this.router.navigateByUrl('/login');
  }
  customerService = inject(CustomerService);
  categoryService = inject(CategoryService);
  categoryList:Category[]=[];
  authService = inject(AuthService);
  wishlistService = inject(WishlistService);
  cartService = inject(CartService);
  cartDrawerService = inject(CartDrawerService);
  searchTerm: string = '';
  private searchTimeout: any;
  cartDrawerOpened = false;

  ngOnInit() {
    this.loadCategories();
    this.categoryService.categoryRefresh$.subscribe(() => {
      this.loadCategories();
    });
    this.wishlistService.init();
    this.cartService.init();
    
    // Subscribe to cart drawer service
    this.cartDrawerService.cartDrawerOpened$.subscribe(opened => {
      this.cartDrawerOpened = opened;
    });
  }

  loadCategories() {
    this.customerService.getCategories().subscribe((result) => {
      this.categoryList = result;
    });
  }

  router=inject(Router);
  onSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      if (this.searchTerm && this.searchTerm.trim()) {
        this.router.navigateByUrl("/products?search=" + encodeURIComponent(this.searchTerm.trim()));
      }
    }, 400);
  }

  searchCategory(id:String) {
    this.searchTerm=""; 
    this.router.navigateByUrl("/products?categoryId="+id!)
  }

  openCartDrawer() {
    this.cartDrawerService.openCartDrawer();
  }
  
  closeCartDrawer() {
    this.cartDrawerService.closeCartDrawer();
  }

  logout(){
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }
}