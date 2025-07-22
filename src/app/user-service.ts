import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResponse, IDeleteUserDataRequestModel, IUpdateUserDataRequestModel, IUsers } from './models/users';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

   constructor(private httpclient: HttpClient){

   }
  public url:string = 'http://localhost:5052/api';

  GetUsers() {
    return this.httpclient.get<IApiResponse<IUsers[]>>(`${this.url}/User/GetAll`)
    .pipe(map(response => {
          if (!response.success) {
            console.error('Erros da API:', response.errors);
          }
          return response.data;
        })
        );
  }

  updateUser(command: IUpdateUserDataRequestModel) {
    return this.httpclient.put<IApiResponse<any>>(`${this.url}/User/${command.userID}`, command);
  }

  deleteUser(command: IDeleteUserDataRequestModel) {
    return this.httpclient.delete<IApiResponse<any>>(`${this.url}/User/${command.userID}`);
  }
}
