import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrandService } from '../../../services/brand.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { popResultSelector } from 'rxjs/internal/util/args';

@Component({
  selector: 'app-brand-form',
  imports: [MatInputModule, 
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.scss'
})
export class BrandFormComponent {
  name!:String;
  brandService = inject(BrandService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  id!:string;
  ngOnInit(){
    this.id = this.route.snapshot.params["id"];
    if(this.id){
        this.brandService.getBrandById(this.id).subscribe((result) => {
          console.log(result);
          this.name=result.name;
      });
    }
  }
  add(){
    this.brandService.addBrand(this.name).subscribe(result=>{
      alert("Brand Added");
      this.router.navigateByUrl("/admin/brands");
    });
  }
  update(){
    this.brandService.updateBrand(this.id, this.name).subscribe(result=>{
      alert("Brand Updated");
      this.router.navigateByUrl("/admin/brands");
    });
  }

}
