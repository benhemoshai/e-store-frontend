import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userName: string | null = null;
  isAdmin = false; // Track if the user is an admin
  private userSubscription?: Subscription;
  isMobile: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Initial check to trigger authentication status immediately
    this.authService.checkAuthStatus().subscribe();

    this.userSubscription = this.authService.currentUser$.subscribe((user) => {
      console.log('Full user object:', user);
      
      this.isLoggedIn = !!user;
      this.userName = user?.userName || user?.email || null;
      this.isAdmin = user?.role === 'admin'; // Check if the user is an admin
      
      console.log('Navbar isLoggedIn:', this.isLoggedIn);
      console.log('Navbar userName:', this.userName);
      console.log('Navbar isAdmin:', this.isAdmin);
    });

    this.checkScreenSize();
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768; // Mobile breakpoint
  }

  logout(): void {
    this.authService.logout().subscribe(
      () => {
        this.router.navigate(['/auth/login']); // Redirect to login page after logout
      },
      (error) => {
        console.error('Logout failed:', error);
        alert('Failed to log out. Please try again.');
      }
    );
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
