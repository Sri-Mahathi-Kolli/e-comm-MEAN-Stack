import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginToggleService {
  private signUpSubject = new BehaviorSubject<boolean>(false);
  signUp$ = this.signUpSubject.asObservable();

  toggle(signUp: boolean) {
    this.signUpSubject.next(signUp);
  }
}
