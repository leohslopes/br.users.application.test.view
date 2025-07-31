import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResponse, IDeleteUserDataRequestModel, IFilterUsersRequestModel, IReportUserAllAges, IReportUserGender, IReportUserPicture, IReportUsersDashboard, IResultSetImportArchive, IUpdateUserDataRequestModel, IUsers } from './models/users';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpclient: HttpClient) {

  }
  public url: string = 'http://localhost:5052/api';

  GetUsers(command: IFilterUsersRequestModel) {
    const params = new HttpParams()
      .set('FilterName', command.filterName || '')
      .set('FilterEmail', command.filterEmail || '')
      .set('FilterImg', String(command.filterImg ?? ''))
      .set('FilterRecentUsers', String(command.filterRecentUsers ?? ''))
      .set('FilterGender', command.filterGender || '');

    return this.httpclient.get<IApiResponse<IUsers[]>>(`${this.url}/User/filter-users`, { params })
      .pipe(
        map(response => {
          if (!response.success) {
            console.error('Erros da API:', response.errors);
          }
          return response.data;
        })
      );
  }

  updateUser(userID: number, formData: FormData): Observable<IApiResponse<any>> {
    return this.httpclient.put<IApiResponse<any>>(`${this.url}/User/${userID}`, formData);
  }

  deleteUser(command: IDeleteUserDataRequestModel) {
    return this.httpclient.delete<IApiResponse<any>>(`${this.url}/User/${command.userID}`);
  }

  import(formData: FormData) {
    return this.httpclient.post<IApiResponse<IResultSetImportArchive>>(`${this.url}/Archive/Import`, formData);
  }

  download() {
    return this.httpclient.get<any>(`${this.url}/Archive/Download`);
  }

  deleteFile() {
    return this.httpclient.delete<any>(`${this.url}/Archive/Delete`);
  }

  getDashboard() {
    return this.httpclient.get<IApiResponse<IReportUsersDashboard[]>>(`${this.url}/Dashboard/GetDashboardTotal`)
      .pipe(
        map(response => {
          if (!response.success) {
            console.error('Erros da API:', response.errors);
          }
          return response.data;
        })
      );
  }

  getDashboardGender() {
    return this.httpclient.get<IApiResponse<IReportUserGender[]>>(`${this.url}/Dashboard/GetDashboardGender`)
      .pipe(
        map(response => {
          if (!response.success) {
            console.error('Erros da API:', response.errors);
          }
          return response.data;
        })
      );
  }

  getDashboardAge() {
    return this.httpclient.get<IApiResponse<IReportUserAllAges[]>>(`${this.url}/Dashboard/GetDashboardAge`)
      .pipe(
        map(response => {
          if (!response.success) {
            console.error('Erros da API:', response.errors);
          }
          return response.data;
        })
      );
  }

  getDashboardPicture() {
    return this.httpclient.get<IApiResponse<IReportUserPicture[]>>(`${this.url}/Dashboard/GetDashboardPicture`)
      .pipe(
        map(response => {
          if (!response.success) {
            console.error('Erros da API:', response.errors);
          }
          return response.data;
        })
      );
  }
}
