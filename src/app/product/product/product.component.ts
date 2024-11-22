import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../../models/product';
import { CartService } from '../../cart/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  product!: Product;
  productId!: string;
  isLoggedIn = false;
  isAdmin = false; // Track if the user is an admin
  showReviews = false;
  isEditing = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Fetch the product ID from the route
    this.productId = this.route.snapshot.paramMap.get('id')!;

    // Fetch product details
    this.productService.getProduct(this.productId).subscribe({
      next: (data) => {
        this.product = data;
      },
      error: () => {
        this.snackbar.open('Error loading product details', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });

    // Subscribe to authentication state
    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user; // Update login state
      this.isAdmin = user?.role === 'admin'; // Check if the user is an admin
    });
  }

  toggleReviews(): void {
    this.showReviews = !this.showReviews;
  }

  addToCart(): void {
    if (!this.product || !this.product._id) {
      console.error('Invalid product', this.product);
      return;
    }

    // Check if the user is logged in
    if (!this.isLoggedIn) {
      this.snackbar.open('Please log in to add items to the cart.', '', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return;
    }

    // Add product to cart
    this.cartService.addToCart({ product: this.product, quantity: 1 }).subscribe({
      next: () => {
        this.snackbar.open('Added to Cart', '', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      error: () => {
        this.snackbar.open('Error adding to cart', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });
  }

toggleEditMode(): void {
  this.isEditing = !this.isEditing;
}

updateProduct(): void {
  this.productService.updateProduct(this.productId, this.product).subscribe({
    next: () => {
      this.snackbar.open('Product updated successfully!', '', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      this.isEditing = false; // Exit edit mode
    },
    error: () => {
      this.snackbar.open('Error updating product.', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    },
  });
}

}
