import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CategoriesComponent } from './components/manage/categories/categories.component';
import { CategoryFormComponent } from './components/manage/category-form/category-form.component';
import { BrandsComponent } from './components/manage/brands/brands.component';
import { BrandFormComponent } from './components/manage/brand-form/brand-form.component';
import { ProductsComponent } from './components/manage/products/products.component';
import { ProductFormComponent } from './components/manage/product-form/product-form.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { authGuard } from './core/auth-guard';
import { AdminDashboardComponent } from './components/manage/admin-dashboard/admin-dashboard.component';
import { adminGuard } from './core/admin-guard';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { WishlistsComponent } from './components/wishlists/wishlists.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CustomerOrdersComponent } from './components/customer-orders/customer-orders.component';
import { OrdersComponent } from './components/manage/orders/orders.component';
import { ContactComponent } from './components/contact/contact.component';
import { AuthComponent } from './auth/auth.component';
import { ForgotComponent } from './forgot/forgot.component';
import { RecentlyViewedComponent } from './components/recently-viewed/recently-viewed.component';

export const routes: Routes = [
                {
                    path: '',
                    component: HomeComponent,
                    canActivate: [authGuard]
                },
                {
                    path: 'admin',
                    component: AdminDashboardComponent,
                    canActivate: [adminGuard]
                },
                {
                    path: 'admin/categories',
                    component: CategoriesComponent,
                    canActivate: [adminGuard]
                },
                {
                    path: 'admin/categories/add',
                    component: CategoryFormComponent,
                    canActivate: [adminGuard]
                },
                {
                    path: 'admin/categories/:id',
                    component: CategoryFormComponent,
                    canActivate: [adminGuard]
                },
                {
                    path: 'admin/brands',
                    component: BrandsComponent,
                    canActivate: [adminGuard]
                },
                {
                    path: 'admin/brands/add',
                    component: BrandFormComponent,
                    canActivate: [adminGuard]
                },
                {
                    path: 'admin/brands/:id',
                    component: BrandFormComponent,
                    canActivate: [adminGuard]
                },
                {
                    path: 'admin/products',
                    component: ProductsComponent,
                    canActivate: [adminGuard]
                },
                {
                    path: 'admin/products/add',
                    component: ProductFormComponent,
                    canActivate: [adminGuard]
                },
                {
                    path: 'admin/products/:id',
                    component: ProductFormComponent,
                    canActivate: [adminGuard]
                },
                {
                    path: 'admin/orders',
                    component: OrdersComponent,
                    canActivate: [adminGuard]
                },
                {
                    path: 'products',
                    component: ProductListComponent,
                    canActivate: [authGuard]
                },
                {
                    path: 'product/:id',
                    component: ProductDetailComponent,
                    canActivate: [authGuard]
                },
                {
                    path: 'profile',
                    component: CustomerProfileComponent,
                    canActivate: [authGuard]
                },
                {
                    path: 'wishlists',
                    component: WishlistsComponent,
                    canActivate: [authGuard]
                },
                {
                    path: 'recently-viewed',
                    component: RecentlyViewedComponent,
                    canActivate: [authGuard]
                },
                {
                    path: 'cart',
                    component: ShoppingCartComponent,
                    canActivate: [authGuard]
                },
                {
                    path: 'orders',
                    component: CustomerOrdersComponent,
                    canActivate: [authGuard]
                },
                {
                    path: 'register',
                    component: AuthComponent
                },
                {
                    path: 'login',
                    component: AuthComponent
                },
                {
                    path: 'forgot',
                    component: ForgotComponent
                },
                {
                    path: 'contact',
                    component: ContactComponent
                }
            ];
