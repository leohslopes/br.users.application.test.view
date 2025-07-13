import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private router: Router) {}

  /** Retorna o token salvo (ou null) */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /** Guarda o token e atualiza o estado de login */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.loggedIn$.next(true);
  }

  /** Remove token e redireciona para login */
  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.loggedIn$.next(false);
    this.router.navigate(['/auth/login']);
  }

  /** Observable para componentes se inscreverem */
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  /** Checa sincronamente */
  isAuthenticated(): boolean {
    return this.loggedIn$.value;
  }

/** Checa se há token no Storage */
  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
