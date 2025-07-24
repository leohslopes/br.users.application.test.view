

export interface IUsers {
  userID: number,
  userName: string,
  userEmail: string,
  userAge: number,
  userGender: string,
  userPassword: string,
  userPicture: any,
  userOfficialNumber: string,
  dateAlter: any
}

export interface IApiResponse<T> {
  data: T;
  success: boolean;
  errors: Record<string, any>;
}

export interface IItemUserDataRequestModel {
  userName: string,
  userEmail: string,
  userAge: number,
  userGender: string,
  userPassword: string,
  userOfficialNumber: string
}

export interface ILoginModel {
  userEmail: string,
  userPassword: string
}

export interface IUpdateUserDataRequestModel {
  userID: number,
  userName: string,
  userEmail: string,
  userAge: number,
  userGender: string,
  userPassword: string,
  userPicture: string
}

export interface IDeleteUserDataRequestModel{
  userID: number
}

export interface IFilterUsersRequestModel {
  filterName: string,
  filterEmail: string
  filterImg: boolean
}