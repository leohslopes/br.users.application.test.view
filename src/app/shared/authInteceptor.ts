import { UserAuthService } from "./user-auth-service";
import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(UserAuthService);
  const token = auth.getToken();

  const authReq = token
    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
    : req;

  return next(authReq);
};