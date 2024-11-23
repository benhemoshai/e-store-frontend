import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReviewService } from './review.service';
import { AuthService } from '../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  @Input() productId!: string | null;
  reviews: any[] = [];
  newReview = { name: '', rating: 0, comment: '' };
  isLoggedIn = false;
  isAdmin = false;
  sortOption: string = 'recent'; // Default sort option

  constructor(
    private route: ActivatedRoute,
    private reviewService: ReviewService,
    private authService: AuthService,
    private snackBar: MatSnackBar // Inject MatSnackBar here
  ) {}

  ngOnInit(): void {
    if (!this.productId) {
      this.productId = this.route.snapshot.paramMap.get('id');
    }

    this.getReviews();

    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === 'admin';
      this.newReview.name = user?.userName || '';
    });
  }

  getReviews(): void {
    if (this.productId) {
      this.reviewService.getReviews(this.productId).subscribe({
        next: (data) => {
          this.reviews = data || [];
          this.sortReviews(); // Sort reviews after fetching
        },
        error: (error) => {
          console.error('Error fetching reviews:', error);
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

    this.reviewService.addReview(this.productId, this.newReview).subscribe({
      next: () => {
        this.snackBar.open('Your review has been added', '', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.getReviews();
        this.resetNewReview();
      },
      error: (error) => {
        console.error('Error adding review:', error);
      },
    });
  }

  private resetNewReview(): void {
    this.newReview = {
      name: this.authService.getUsername() || '',
      rating: 0,
      comment: '',
    };
  }

  sortReviews(): void {
    switch (this.sortOption) {
      case 'recent':
        this.reviews.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case 'rating':
        this.reviews.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
  }

  onSortChange(option: string): void {
    this.sortOption = option;
    this.sortReviews();
  }
}
