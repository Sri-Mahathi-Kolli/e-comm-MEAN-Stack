import { Component, inject } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../types/category';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [RouterLink,
    FormsModule, MatIconModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  customerService = inject(CustomerService);
  categoryList:Category[]=[];
  authService = inject(AuthService);
  searchTerm!: String;
  ngOnInit() {
    this.customerService.getCategories().subscribe((result) => {
      this.categoryList = result;
    });
  }

  router=inject(Router);
  onSearch(e:any) {
    if(e.target.value) {
      this.router.navigateByUrl("/products?search="+e.target.value)
    }
  }

  searchCategory(id:String  ) {
    this.searchTerm=""; 
    this.router.navigateByUrl("/products?categoryId=" + id!);
  }
  

  logout(){
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }
}
