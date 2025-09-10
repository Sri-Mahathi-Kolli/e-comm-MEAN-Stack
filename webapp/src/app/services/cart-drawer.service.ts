import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartDrawerService {
  private cartDrawerOpenedSubject = new BehaviorSubject<boolean>(false);
  public cartDrawerOpened$ = this.cartDrawerOpenedSubject.asObservable();

  constructor() { }

  openCartDrawer() {
    this.cartDrawerOpenedSubject.next(true);
  }

  closeCartDrawer() {
    this.cartDrawerOpenedSubject.next(false);
  }

  toggleCartDrawer() {
    this.cartDrawerOpenedSubject.next(!this.cartDrawerOpenedSubject.value);
  }

  get isOpen(): boolean {
    return this.cartDrawerOpenedSubject.value;
  }
}
