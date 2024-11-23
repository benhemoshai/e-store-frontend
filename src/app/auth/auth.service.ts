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
      .post<User>(`${this.apiURL}/register`, userData, { withCredentials: true })
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
      .post<User>(`${this.apiURL}/login`, credentials, { withCredentials: true })
      .pipe(
        tap((user) => {
          console.log('Login response:', user);
          this.currentUserSubject.next(user); // Immediately update user state
          
          // Optional: Trigger a quick check to ensure persistence
          this.checkAuthStatus().subscribe();
        }),
        catchError((error) => {
          console.error('Login failed:', error);
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
      .post<void>(`${this.apiURL}/logout`, {}, { withCredentials: true })
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
    return this.http.get<{user: User}>(`${this.apiURL}/auth-check`, { withCredentials: true }).pipe(
      tap((response) => {
        console.log('Auth check user:', response.user);
        this.currentUserSubject.next(response.user); 
      }),
      catchError((error) => {
        console.error('Auth check error:', error);
        this.currentUserSubject.next(null);
        return of(null);
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
  fetchCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiURL}/auth-check`, { withCredentials: true }).pipe(
      tap((user) => {
        this.currentUserSubject.next(user); // Update user state after fetching details
      }),
      catchError((error) => {
        console.error('Failed to fetch current user:', error);
        this.currentUserSubject.next(null);
        throw error;
      })
    );
  }
}
