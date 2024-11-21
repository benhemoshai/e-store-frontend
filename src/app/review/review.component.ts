import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReviewService } from './review.service'; // Adjust path as necessary
import { AuthService } from '../auth/auth.service'; // Adjust to the correct path

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
})
export class ReviewComponent implements OnInit {
  @Input() productId!: string | null; // Product ID passed as an input
  reviews: any[] = []; // Array to hold reviews
  newReview = { name: '', rating: 0, comment: '' }; // New review object
  isLoggedIn = false; // Tracks login state

  constructor(
    private route: ActivatedRoute,
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Fetch product ID from the route if not passed as input
    if (!this.productId) {
      this.productId = this.route.snapshot.paramMap.get('id');
    }

    // Load reviews
    this.getReviews();

    // Subscribe to authentication state
    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user; // Update login state
      this.newReview.name = user?.userName || ''; // Set the user's name for the review
    });
  }

  getReviews(): void {
    if (this.productId) {
      // Fetch reviews using ReviewService
      this.reviewService.getReviews(this.productId).subscribe({
        next: (data) => {
          this.reviews = data || []; // Populate reviews array
        },
        error: (error) => {
          console.error('Error fetching reviews:', error); // Log errors
        },
      });
    }
  }

  addReview(): void {
    if (!this.isLoggedIn) {
      alert('Please log in to add a review.');
      return;
    }

    if (!this.productId || this.newReview.rating <= 0 || !this.newReview.comment.trim()) {
      alert('Please provide a valid rating and comment.');
      return;
    }

    // Add the review using ReviewService
    this.reviewService.addReview(this.productId, this.newReview).subscribe({
      next: () => {
        this.getReviews(); // Refresh reviews after adding
        this.resetNewReview(); // Reset the new review form
      },
      error: (error) => {
        console.error('Error adding review:', error); // Log errors
      },
    });
  }

  private resetNewReview(): void {
    this.newReview = {
      name: this.authService.getUsername() || '', // Pre-fill the name field if logged in
      rating: 0,
      comment: '',
    };
  }
}
