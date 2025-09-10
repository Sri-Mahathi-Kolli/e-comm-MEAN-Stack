import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrandService } from '../../../services/brand.service';
import { ActivatedRoute, Router } from '@angular/router';
import { P } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-brand-form',
  imports: [MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.scss'
})
export class BrandFormComponent {
  name!: String;
  brandService = inject(BrandService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  id!: String;

  ngOnInit() {
    this.id = this.route.snapshot.params["id"];
    if (this.id) {
      this.brandService.getBrandById(this.id).subscribe(result => {
        this.name = result.name;
      });
    }
  }

  add() {
    this.brandService.addBrand(this.name).subscribe(result => {
      alert("Brand added");
      this.router.navigateByUrl("/admin/brands");
    });
  }

  update() {
    this.brandService.updateBrand(this.id, this.name).subscribe(result => {
      alert("Brand updated");
      this.router.navigateByUrl("/admin/brands");
    });
  }


}
