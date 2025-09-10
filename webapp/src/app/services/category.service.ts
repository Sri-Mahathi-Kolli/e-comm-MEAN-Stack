import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category } from '../types/category';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // Subject to trigger category refresh
  public categoryRefresh$ = new Subject<void>();
  http=inject(HttpClient);

  constructor() { }
  getCategories(){
    return this.http.get<Category[]>(environment.apiUrl+"/category/")
  }

getCategoryById(id:string){
    return this.http.get<Category[]>(environment.apiUrl+'/category/'+id);
  }

  addCategory(name:String){
    return this.http.post(environment.apiUrl+"/category/",{
       name:name,
    });
  }
  updateCategory(id:string,name:String){
    return this.http.put(environment.apiUrl+'/category/'+id,{
       name:name,
    });
  }
deleteCategoryById(id:string){
    return this.http.delete(environment.apiUrl+'/category/'+id);
  }
}
