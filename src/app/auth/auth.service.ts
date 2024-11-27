import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { RegisterInput } from '../models/register-input';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiURL = environment.apiURL;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Register a new user.
   * @param userData - Registration input.
   * @returns Observable<User>
   */
  register(userData: RegisterInput): Observable<User> {
    return this.http
      .post<User>(`${this.apiURL}/auth/register`, userData, { withCredentials: true })
      .pipe(
        tap((user) => {
          console.log('Register response:', user); // Debugging
          this.currentUserSubject.next(user); // Automatically log in the user
        }),
        catchError((error) => {
          console.error('Registration failed:', error);
          throw error;
        })
      );
  }
  

  /**
   * Log in the user.
   * @param credentials - Email and password.
   * @returns Observable<any>
   */
  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http
      .post<User>(`${this.apiURL}/auth/login`, credentials, { withCredentials: true })
      .pipe(
        tap((user) => {
          console.log('Login response:', user);
          this.currentUserSubject.next(user); // Immediately update user state
        }),
        catchError((error) => {
          this.currentUserSubject.next(null);
          throw error;
        })
      );
  }
  

  /**
   * Log out the current user.
   * @returns Observable<void>
   */
  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.apiURL}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.currentUserSubject.next(null); // Clear current user state on logout
        }),
        catchError((error) => {
          console.error('Logout failed:', error);
          throw error;
        })
      );
  }

  /**
   * Check the current authentication status.
   * @returns Observable<any>
   */
  checkAuthStatus(): Observable<any> {
    return this.http
      .get<{ user: User }>(`${this.apiURL}/users/auth-check`, { withCredentials: true })
      .pipe(
        tap((response) => {
          if (response?.user) {
            this.currentUserSubject.next(response.user);
          } else {
            this.currentUserSubject.next(null);
          }
        }),
        catchError((error) => {
          this.currentUserSubject.next(null);
          console.error('Auth check failed:', error);
          return of(null); // Prevent breaking the app on failed checks
        })
      );
  }
  
  
  
  
  /**
   * Get the current user's username.
   * @returns string
   */
  getUsername(): string {
    return this.currentUserSubject.value ? this.currentUserSubject.value.userName : '';
  }

  /**
   * Fetch current user details from the backend and update the user state.
   * @returns Observable<User>
   */
  fetchCurrentUser(): Observable<User | null> {
    return this.http.get<User>(`${this.apiURL}/users/auth-check`, { withCredentials: true }).pipe(
      tap((user) => {
        if (user) {
          this.currentUserSubject.next(user); // Update user state if valid
        } else {
          this.currentUserSubject.next(null); // Clear user state if no user found
        }
      }),
      catchError((error) => {
        console.error('Failed to fetch current user:', error);
        this.currentUserSubject.next(null); // Ensure state is cleared on error
        return of(null); // Return a safe default value to avoid breaking
      })
    );
  }
  
}
