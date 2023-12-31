import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { LoginResponse } from './interfaces/login-response';
import { LoginDto } from './interfaces/login-dto';
// import { CheckResponse } from './interfaces/check-response';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ResponseSuccess } from '../interfaces/response.dto';
import { User } from '../../user-menu/user/interface/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private api: ApiService, private router: Router) { }
  public key: string = "userToken";
  baseUrl: string = "auth/";
  loginUrl: string = "login";
  checkUrl: string = "check";

  login(data: LoginDto) {
    return this.api.postAPI<LoginResponse>(this.baseUrl + this.loginUrl, data);
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login')
  }

  getLocalStorageToken(): string {
    let key = window.btoa(this.key);
    let fakeToken = localStorage.getItem(key) || "";
    let token = window.atob(fakeToken);
    return token;
  }

  setLocalStorageToken(token: string) {
    let scramble: string = window.btoa(this.key);
    let scrambleToken: string = window.btoa(token);

    let fakeKey: string = window.btoa(this.faker(10));
    let fakeToken: string = window.btoa(this.faker(30));

    localStorage.setItem(scramble, scrambleToken);
    localStorage.setItem(fakeKey, fakeToken);
  }

  getHeadersAuth() {
    let hdrs = new HttpHeaders({
      'Authorization': `Bearer ${this.getLocalStorageToken()}`
    })
    return hdrs;
  }

  checkLogin() {
    return this.api.getAPI<ResponseSuccess<User>>(this.baseUrl + this.checkUrl);
  }

  faker(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
}
