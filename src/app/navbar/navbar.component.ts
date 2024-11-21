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
  private userSubscription?: Subscription;
  isMobile: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Restore session and authentication state
    this.authService.checkAuthStatus().subscribe(() => {
      // Subscribe to authentication state changes
      this.userSubscription = this.authService.currentUser$.subscribe((user) => {
        this.isLoggedIn = !!user; // Update login state dynamically
        this.userName = user?.userName || null; // Update username dynamically
        console.log('Navbar updated userName:', this.userName); // Debugging
      });
    });
  
  

    // Initialize screen size
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
