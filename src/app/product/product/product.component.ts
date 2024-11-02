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
    private authService: AuthService  // Add AuthService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    
    this.productService.getProduct(this.productId).subscribe({
      next: (data) => {
        this.product = data;
      },
      error: (error) => {
        this.snackbar.open('Error loading product details', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

  toggleReviews() {
    this.showReviews = !this.showReviews;
  }

  addToCart(product: Product): void {
    if (!product || !product._id) {
      console.error('Invalid product', product);
      return;
    }
  
    // Get current user from AuthService
    this.authService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        // Ensure user exists and has userId
        if (!user || !user.userId) {
          this.snackbar.open('Please log in to add items to cart', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          return;
        }
  
        // User is authenticated; proceed to get cart items
        this.cartService.getCartItems(user.userId).subscribe({
          next: (cartItems) => {
            const existingCartItem = cartItems.find(item => 
              item.product && item.product._id === product._id
            );
  
            if (existingCartItem) {
              existingCartItem.quantity = (existingCartItem.quantity || 0) + 1;
              this.cartService.updateCartItem(user.userId, existingCartItem).subscribe({
                next: () => {
                  this.snackbar.open('Updated Quantity in Cart', '', {
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    duration: 2000
                  });
                },
                error: (error) => {
                  this.snackbar.open('Error updating cart', 'Close', {
                    duration: 3000,
                    horizontalPosition: 'right',
                    verticalPosition: 'top'
                  });
                }
              });
            } else {
              const newCartItem = new CartItem(product, 1);
              this.cartService.addToCart(user.userId, newCartItem).subscribe({
                next: () => {
                  this.snackbar.open('Added To Cart', '', {
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    duration: 2000
                  });
                },
                error: (error) => {
                  this.snackbar.open('Error adding to cart', 'Close', {
                    duration: 3000,
                    horizontalPosition: 'right',
                    verticalPosition: 'top'
                  });
                }
              });
            }
          },
          error: (error) => {
            this.snackbar.open('Error accessing cart', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
          }
        });
      },
      error: (error) => {
        this.snackbar.open('Authentication error', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }
  
}