import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize the form with email and password fields
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    const credentials = this.loginForm.value;
    this.authService.login(credentials).subscribe({
      next: () => {
        // Route all users to the products page
        this.router.navigate(['/products']);
      },
      error: () => {
        this.error = 'Invalid email or password';
        alert('Login error: ' + this.error);
      }
    });
  }
}
