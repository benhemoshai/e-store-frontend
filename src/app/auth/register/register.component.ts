import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService,  private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required], // Updated from name to userName
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { userName, email, password } = this.registerForm.value; // Updated from name to userName
      const registrationData = { userName, email, password }; // Updated here too

      this.authService.register(registrationData).subscribe(
        response => {
          alert('Registration successful!');
          console.log('Registration successful:', response);
          this.router.navigate(['/products']);
        },
        error => {
          if (error.status === 400 && error.error.message === 'User already exists') {
            alert('This email is already registered. Please use a different email.');
          } else {
            alert('Registration failed. Please try again.');
          }
          console.error('Registration error:', error);
        }
      );
    }
  }
}
