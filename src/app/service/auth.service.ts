import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, map, Observable, switchMap, of } from 'rxjs';
import { User } from '../interfaces/user.interface';

const BASE = 'https://68c4981d81ff90c8e61c9e6a.mockapi.io/api/v1';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private state$ = new BehaviorSubject<User | null>(load());
  user$ = this.state$.asObservable();

  constructor(private http: HttpClient) {}

  get user(): User | null { return this.state$.value; }
  get isLoggedIn(): boolean { return !!this.state$.value; }
  get isAdmin(): boolean { return this.state$.value?.role === 'admin'; }

  // התחברות
  login(email: string, password: string): Observable<boolean> {
    const params = new HttpParams().set('email', email).set('password', password);
    return this.http.get<User[]>(`${BASE}/users`, { params }).pipe(
      map(rows => {
        const u = rows?.[0] ?? null;
        if (!u) return false;
        const safe: User = { id: u.id, name: u.name, email: u.email, role: u.role };
        this.state$.next(safe);
        localStorage.setItem('session_user', JSON.stringify(safe));
        return true;
      })
    );
  }

  // הרשמה (פשוטה): אם האימייל כבר קיים → false; אחרת יוצר משתמש ומחבר אוטומטית
  register(
    name: string,
    email: string,
    password: string,
    role: 'user' | 'admin' = 'user'
  ): Observable<boolean> {
    const checkParams = new HttpParams().set('email', email);

    return this.http.get<User[]>(`${BASE}/users`, { params: checkParams }).pipe(
      switchMap(rows => {
        if (rows && rows.length) {
          // כבר קיים משתמש עם אותו אימייל
          return of(false);
        }
        const body: User = { name, email, password, role };
        return this.http.post<User>(`${BASE}/users`, body).pipe(
          map(u => {
            const safe: User = { id: u.id, name: u.name, email: u.email, role: u.role };
            this.state$.next(safe);
            localStorage.setItem('session_user', JSON.stringify(safe));
            return true;
          })
        );
      })
    );
  }

  // התנתקות
  logout(): void {
    this.state$.next(null);
    localStorage.removeItem('session_user');
  }
}

function load(): User | null {
  try { return JSON.parse(localStorage.getItem('session_user') || 'null'); }
  catch { return null; }
}
