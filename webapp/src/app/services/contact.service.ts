
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private http: HttpClient) {}

  submitContact(data: { name: string; email: string; subject: string; message: string }): Observable<any> {
    return this.http.post(environment.apiUrl + '/api/contact', data);
  }
}
