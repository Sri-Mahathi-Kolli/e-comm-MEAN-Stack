

import { HttpBackend, HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  verifySecurityAnswer(email: string, question: string, answer: string, newPassword: string) {
    return this.http.post(environment.apiUrl + '/auth/verify-security-answer', {
      email,
      question,
      answer,
      newPassword
    });
  }
  getSecurityQuestions(email: string) {
    return this.http.post(environment.apiUrl + '/auth/get-security-questions', { email });
  }

  verifySecurityAnswers(email: string, answers: string[], newPassword: string) {
    return this.http.post(environment.apiUrl + '/auth/verify-security-answers', {
      email,
      answers,
      newPassword
    });
  }
  updateProfile(profile: any) {
    return this.http.put(environment.apiUrl + "/profile", profile);
  }

    getProfile() {
      const token = localStorage.getItem('token');
      return this.http.get(environment.apiUrl + '/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    changePassword(oldPassword: string, newPassword: string) {
      const token = localStorage.getItem('token');
      return this.http.put(environment.apiUrl + '/profile/change-password', { oldPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  resetPassword(token: String, password: String) {
    return this.http.post(environment.apiUrl + "/auth/reset-password", { token, password });
  }

  constructor() { }
  http=inject(HttpClient)

  register(firstName: String, lastName: String, email: String, password: String, securityQuestions: any[]) {
    return this.http.post(environment.apiUrl + "/auth/register", {
      firstName,
      lastName,
      email,
      password,
      securityQuestions
    });
  }

  forgotPassword(email: String) {
    return this.http.post(environment.apiUrl + "/auth/forgot-password", { email });
  }

  login(email:String,password:String){
    return this.http.post(environment.apiUrl+"/auth/login",{
      email,
      password,
    });
  }

  get isLoggedIn(){
    let token=localStorage.getItem("token");
    if(token){
      return true;
    }
    return false;
  }
    get isAdmin(){
  
    let userData = localStorage.getItem("user");
    if (userData) {
      const isAdmin = JSON.parse(userData).isAdmin;
      // Always return boolean true only if isAdmin is boolean true or string 'true'
      return isAdmin === true || isAdmin === "true";
    }
    return false;
  }





  get userName(){
    let userData=localStorage.getItem("user");
    if(userData){
      return JSON.parse(userData).name;
    }
    return null;
  }

   get userEmail(){
    let userData=localStorage.getItem("user");
    if(userData){
      return JSON.parse(userData).email;
    }
    return null;
  }
  logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

