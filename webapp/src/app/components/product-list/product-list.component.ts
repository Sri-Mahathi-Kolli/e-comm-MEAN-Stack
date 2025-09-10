import { Component, inject } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Product } from '../../types/product';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ActivatedRoute } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import { Category } from '../../types/category';
import { Brand } from '../../types/brand';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent,MatSelectModule,FormsModule,MatButtonModule,],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  customerService = inject(CustomerService);
  searchTerm: String = '';
  categoryId: String = '';
  sortBy: String = '';
  sortOrder: Number = -1;
  brandId: String = '';
  page = 1;
  pageSize = 6;
  products: Product[] = [];
  route = inject(ActivatedRoute);
  category:Category[]=[];
  brands:Brand[]=[];

  // Shuffle function to randomize array order
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  ngOnInit(){
    this.customerService.getCategories().subscribe(result=>{
      this.category=result;
    })
    this.customerService.getBrands().subscribe(result=>{
      this.brands=result;
    })




    this.route.queryParams.subscribe((x: any) => {
      this.searchTerm = x.search || '';
      this.categoryId = x.categoryId || '';

      this.getProducts();
    });

  }

  getProducts(){
    setTimeout(()=>{
      this.customerService.getProducts(this.searchTerm,
      this.categoryId,
      this.sortBy,
      this.sortOrder,
      this.brandId,
      this.page,
      this.pageSize
    ).subscribe(result => {
      // Only shuffle if no specific sorting is applied
      if (!this.sortBy || this.sortBy === '') {
        this.products = this.shuffleArray(result);
      } else {
        this.products = result;
      }
      if (result.length<this.pageSize) {
        this.isNext = false;
      }
    });
    },500)
  }


  orderChange(event:any){
    this.sortBy='Price',
    this.sortOrder=event;
    this.getProducts();
  }

  isNext=true;
  pageChange(page:number){
    this.page=page;
    this.isNext=true;
    this.getProducts();
    
    // Scroll to top of the page or products section
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Alternative: scroll to products section specifically
      // const productsSection = document.querySelector('.flex-1');
      // if (productsSection) {
      //   productsSection.scrollIntoView({ behavior: 'smooth' });
      // }
    }, 100);
  }

}