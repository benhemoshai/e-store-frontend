// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface User {
  userName: any; // Change from name to userName
  email: any,
  password: any
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = environment.apiURL;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check localStorage on initialization
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  register(userData: User): Observable<User> {
    return this.http.post<User>(`${this.apiURL}/register`, userData).pipe(
      
      tap(user => {
        // Store user data as received from backend
        this.setCurrentUser(user);
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.apiURL}/login`, credentials).pipe(
      tap(user => {
        this.setCurrentUser(user);
      })
    );
  }
  

  logout(): void {
    localStorage.removeItem('currentUser'); // Clear stored user data
    this.currentUserSubject.next(null);
  }

  private setCurrentUser(user: User): void {
    // Store the user object received from backend
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  
}
