

export interface IUsers {
  userID: number,
  userName: string,
  userEmail: string,
  userAge: number,
  userGender: string,
  userPassword: string
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
  userPassword: string
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
  userPassword: string
}

export interface IDeleteUserDataRequestModel{
  userID: number
}