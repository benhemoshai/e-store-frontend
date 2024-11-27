import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Fetch the current user to restore login state
    this.authService.fetchCurrentUser().subscribe({
      next: (user) => {
        console.log('User restored on app load:', user);
      },
      error: (error) => {
        console.error('Error during user restoration:', error);
      },
    });
  }
}
