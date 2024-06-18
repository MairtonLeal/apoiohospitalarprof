/* eslint-disable @typescript-eslint/member-ordering */
import {Injectable} from '@angular/core';
import {Keys} from '../app/core/Keys';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userData = null;

  private userToken = null;

  constructor(private httpClient: HttpClient) {
    this.loadDataByStorage();
  }

  isLogged(): boolean {
    this.loadDataByStorage();
    return this.userToken !== null;

  }

  getUserData() {
    this.loadDataByStorage();
    return this.userData;
  }
  private loadDataByStorage(){
    this.userData = JSON.parse(localStorage.getItem(Keys.user));
    this.userToken = localStorage.getItem(Keys.token);
  }


}
