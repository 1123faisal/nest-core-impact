import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthData } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'org_authData';
  private logoutTimeout = 3600000 * 24; // 1 hour in milliseconds
  private timer: any;
  private userSubject = new BehaviorSubject<AuthData | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.autoLogin();
  }

  autoLogin() {
    const authData = this.getAuthData();

    if (authData) {
      const expirationTime = parseInt(authData.expirationTime, 10);
      if (expirationTime > Date.now()) {
        this.userSubject.next(authData);
        this.startLogoutTimer(expirationTime - Date.now());
      } else {
        this.logout();
      }
    } else {
      this.logout();
    }
  }
  logout(): void {
    this.clearAuthData();
    this.userSubject.next(null);
    clearTimeout(this.timer);
    this.router.navigate([
      this.router.url.includes('auth') ? this.router.url : '/auth/login',
    ]);
  }

  updateUser(email: string, avatar: string, mobile: string, name: string) {
    const authData = this.getAuthData();

    if (!authData || !this.userSubject.value) return;

    this.userSubject.next({
      ...(this.userSubject.value || {}),
      email,
      avatar,
      mobile,
      name,
    });

    localStorage.setItem(
      this.tokenKey,
      JSON.stringify({ ...authData, email, avatar, mobile, name })
    );
  }

  getUser(): Observable<AuthData | null> {
    return this.userSubject.asObservable();
  }

  getToken(): string | null {
    const localData = localStorage.getItem(this.tokenKey);
    let authData: AuthData | undefined;
    if (localData) {
      authData = JSON.parse(localData);
    }
    return authData?.token || null;
  }

  getAuthData(): AuthData | undefined {
    const localData = localStorage.getItem(this.tokenKey);
    let authData: AuthData | undefined;
    if (localData) {
      authData = JSON.parse(localData);
    }
    return authData;
  }

  private saveAuthData(authData: AuthData): void {
    const expirationTime = Date.now() + this.logoutTimeout;
    localStorage.setItem(
      this.tokenKey,
      JSON.stringify({ ...authData, expirationTime: expirationTime.toString() })
    );
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
  }

  private startLogoutTimer(expirationTime: number): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.logout();
    }, expirationTime);
  }

  signUp(name: string, email: string, password: string) {
    return this.http
      .post<AuthData>(`${environment.apiUri}/api/v1/org-users/signup`, {
        password,
        name,
        email,
      })
      .pipe(
        tap((response) => {
          this.saveAuthData(response);
          this.userSubject.next(response);
          this.startLogoutTimer(this.logoutTimeout);
        })
      );
  }

  signIn(email: string, password: string) {
    return this.http
      .post<AuthData>(`${environment.apiUri}/api/v1/org-users/login`, {
        password,
        email,
      })
      .pipe(
        tap((response) => {
          this.saveAuthData(response);
          this.userSubject.next(response);
          this.startLogoutTimer(this.logoutTimeout);
        })
      );
  }

  forgotPassword(email: string) {
    return this.http.post(
      `${environment.apiUri}/api/v1/org-users/forget-password/send-otp`,
      {
        email,
      }
    );
  }

  verifyOtp(email: string, otp: string) {
    return this.http.post(
      `${environment.apiUri}/api/v1/org-users/forget-password/verify-otp`,
      {
        email,
        otp,
      }
    );
  }

  resentOtp(email: string) {
    return this.http.post(`${environment.apiUri}/api/v1/org-users/resend-otp`, {
      email,
    });
  }

  resetPassword(
    password: string,
    email: string,
    otp: string,
    confirmPassword: string
  ) {
    return this.http.post(
      `${environment.apiUri}/api/v1/org-users/forget-password/update-password`,
      {
        password,
        email,
        otp,
        confirmPassword,
      }
    );
  }
}
