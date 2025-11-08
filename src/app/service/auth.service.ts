import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, map } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}
export interface ApiUser extends SessionUser {
  password?: string;
}
export type NewUser = {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
};

const USERS_URL = 'https://68c4981d81ff90c8e61c9e6a.mockapi.io/api/v1/users';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'session_user';
  private state$ = new BehaviorSubject<SessionUser | null>(load(this.STORAGE_KEY));
  readonly user$ = this.state$.asObservable();

  constructor(private http: HttpClient) {}

  get user(): SessionUser | null { return this.state$.value; }
  get isLoggedIn(): boolean { return !!this.state$.value; }
  get isAdmin(): boolean { return this.state$.value?.role === 'admin'; }

  login(email: string, password: string): Observable<boolean> {
    const params = new HttpParams().set('email', email);
    return this.http.get<ApiUser[]>(USERS_URL, { params }).pipe(
      catchError(err => err.status === 404 ? of([] as ApiUser[]) : (() => { throw err; })()),
      map(rows => {
        const u = rows?.[0];
        if (!u) return false;
        if (u.password && u.password !== password) return false;
        const safe: SessionUser = { id: u.id, name: u.name, email: u.email, role: u.role };
        this.state$.next(safe);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(safe));
        return true;
      })
    );
  }

  register(name: string, email: string, password: string): Observable<boolean> {
    const checkParams = new HttpParams().set('email', email);
    return this.http.get<ApiUser[]>(USERS_URL, { params: checkParams }).pipe(
      catchError(err => err.status === 404 ? of([] as ApiUser[]) : (() => { throw err; })()),
      switchMap(rows => {
        if (rows && rows.length) return of(false); 
        const body: NewUser = { name, email, password, role: 'user' };
        return this.http.post<ApiUser>(USERS_URL, body).pipe(
          map(u => {
            const safe: SessionUser = {
              id: u.id,
              name: u.name,
              email: u.email,
              role: (u.role as 'user' | 'admin') ?? 'user'
            };
            this.state$.next(safe);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(safe));
            return true;
          })
        );
      })
    );
  }

  logout(): void {
    this.state$.next(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

function load(key: string): SessionUser | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch { return null; }
}
