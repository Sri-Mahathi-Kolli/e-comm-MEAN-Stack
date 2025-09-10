import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [MatInputModule,MatButtonModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  formbuilder=inject(FormBuilder);
  registerForm=this.formbuilder.group({
    firstName:['',[Validators.required]],
    lastName:['',[Validators.required]],
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.minLength(5)]],
  });

  authService=inject(AuthService);
  router=inject(Router);


  register(){
    let value=this.registerForm.value;
    // Add an empty array or actual security questions as the fifth argument
    this.authService.register(value.firstName!, value.lastName!, value.email!, value.password!, []).subscribe(result=>{
      alert("user registered");
      this.router.navigateByUrl("/login");
    });
  }

}
