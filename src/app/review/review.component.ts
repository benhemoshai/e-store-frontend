import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReviewService } from './review.service'; // Adjust path as necessary

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  @Input() productId!: string | null; // Keep the product ID
  reviews: any[] = []; // Array to hold reviews
  newReview = { name: '', rating: 0, comment: '' }; // Initialize rating as a number

  constructor(
    private route: ActivatedRoute,
    private reviewService: ReviewService // Inject the ReviewService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id'); // Get product ID from route
    this.getReviews(); // Load reviews on initialization
  }

  getReviews(): void {
    if (this.productId) {
      // Use ReviewService to fetch reviews
      this.reviewService.getReviews(this.productId).subscribe(
        (data) => {
          this.reviews = data || []; // Set reviews data
        },
        (error) => {
          console.error('Error fetching reviews:', error); // Log errors if any
        }
      );
    }
  }

  addReview(): void {
    if (this.productId && this.newReview.rating > 0 && this.newReview.comment) { // Ensure rating is greater than 0
      // Use ReviewService to add a new review
      this.reviewService.addReview(this.productId, this.newReview).subscribe(
        () => {
          this.getReviews(); // Refresh the reviews after adding a new one
          this.newReview = { name: '' , rating: 0, comment: '' }; // Reset the new review
        },
        (error) => {
          console.error('Error adding review:', error); // Log errors if any
        }
      );
    }
  }
}
