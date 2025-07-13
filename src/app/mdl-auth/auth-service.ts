import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResponse, IItemUserDataRequestModel, ILoginModel } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpclient: HttpClient) {

  }

  public url: string = 'http://localhost:5052/api/Auth';

  login(command: ILoginModel) {
    return this.httpclient.post<IApiResponse<any>>(`${this.url}/Login`, command);
  }

  register(command: IItemUserDataRequestModel) {
    return this.httpclient.post<IApiResponse<any>>(`${this.url}/Register`, command);
  }


}
