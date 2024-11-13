import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../../models/product';
import { CartService } from '../../cart/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../models/cart-item.model';
import { AuthService } from '../../auth/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product!: Product;
  productId!: string;
  showReviews = false;

  constructor(
    private productService: ProductService, 
    private cartService: CartService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    
    this.productService.getProduct(this.productId).subscribe({
      next: (data) => {
        this.product = data;
      },
      error: () => {
        this.snackbar.open('Error loading product details', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

  toggleReviews(): void {
    this.showReviews = !this.showReviews;
  }

  addToCart(product: Product): void {
    if (!product || !product._id) {
      console.error('Invalid product', product);
      return;
    }

    // Check if the user is logged in before proceeding
    if (!this.authService.isLoggedIn()) {
      alert('Please log in to add items to the cart.');
      return;
    }

    // Since the user is logged in, get the current user and proceed with adding to the cart
    this.authService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        // Fetch existing cart items for the user
        this.cartService.getCartItems(user!.userId).subscribe({
          next: (cartItems) => {
            const existingCartItem = cartItems.find(item => 
              item.product && item.product._id === product._id
            );

            if (existingCartItem) {
              // Update quantity if item already exists in the cart
              existingCartItem.quantity = (existingCartItem.quantity || 0) + 1;
              this.cartService.updateCartItem(user!.userId, existingCartItem).subscribe({
                next: () => {
                  this.snackbar.open('Updated Quantity in Cart', '', {
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    duration: 2000
                  });
                },
                error: () => {
                  this.snackbar.open('Error updating cart', 'Close', {
                    duration: 3000,
                    horizontalPosition: 'right',
                    verticalPosition: 'top'
                  });
                }
              });
            } else {
              // Add new item to the cart if not already present
              const newCartItem = new CartItem(product, 1);
              this.cartService.addToCart(user!.userId, newCartItem).subscribe({
                next: () => {
                  this.snackbar.open('Added To Cart', '', {
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    duration: 2000
                  });
                },
                error: () => {
                  this.snackbar.open('Error adding to cart', 'Close', {
                    duration: 3000,
                    horizontalPosition: 'right',
                    verticalPosition: 'top'
                  });
                }
              });
            }
          },
          error: () => {
            this.snackbar.open('Error accessing cart', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
          }
        });
      },
      error: () => {
        this.snackbar.open('Authentication error', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }
}
