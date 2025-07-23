import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResponse, IDeleteUserDataRequestModel, IUpdateUserDataRequestModel, IUsers } from './models/users';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpclient: HttpClient) {

  }
  public url: string = 'http://localhost:5052/api';

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

  // updateUser(command: IUpdateUserDataRequestModel) {
  //   return this.httpclient.put<IApiResponse<any>>(`${this.url}/User/${command.userID}`, command);
  // }

  updateUser(userID: number, formData: FormData): Observable<IApiResponse<any>> {
    // NÃO defina manualmente o Content-Type:
    // o browser vai gerar o multipart boundary pra você.
    return this.httpclient.put<IApiResponse<any>>(
      `${this.url}/User/${userID}`,
      formData
    );
  }

  deleteUser(command: IDeleteUserDataRequestModel) {
    return this.httpclient.delete<IApiResponse<any>>(`${this.url}/User/${command.userID}`);
  }
}
