import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../cart.service';
import { CartItem } from '../../models/cart-item.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.css'],
})
export class CartViewComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  isLoggedIn: boolean = false;
  private authSubscription?: Subscription;

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication state
    this.authSubscription = this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user; // Check if user is logged in
      if (this.isLoggedIn) {
        this.loadCartItems(); // Load cart items if logged in
      } else {
        this.snackBar.open('You must log in to view your cart.', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    });
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe({
      next: (data) => {
        this.cartItems = data;
        this.totalPrice = this.getTotalPrice();
      },
      error: () => {
        this.snackBar.open('Error fetching cart items', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.product.price * (item.quantity || 1),
      0
    );
  }

  removeItem(item: CartItem): void {
    if (item.product?._id) {
      this.cartService.removeFromCart(item.product._id).subscribe({
        next: () => {
          this.loadCartItems();
          this.snackBar.open('Item removed from cart', '', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        },
        error: () => {
          this.snackBar.open('Error removing item from cart', '', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        },
      });
    }
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        this.cartItems = [];
        this.totalPrice = 0;
      },
      error: () => {
        this.snackBar.open('Error clearing cart', '', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });
  }

  incrementQuantity(item: CartItem): void {
    item.quantity++;
    this.cartService.updateCartItem(item).subscribe({
      next: () => {
        this.totalPrice = this.getTotalPrice();
        this.snackBar.open('Item quantity updated', '', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      error: () => {
        this.snackBar.open('Error updating item quantity', '', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.updateCartItem(item).subscribe({
        next: () => {
          this.totalPrice = this.getTotalPrice();
          this.snackBar.open('Item quantity updated', '', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        },
        error: () => {
          this.snackBar.open('Error updating item quantity', '', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        },
      });
    }
  }

  checkOut(): void {
    this.cartService.checkOut(this.cartItems).subscribe({
      next: () => {
        this.snackBar.open('Checkout complete', '', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.clearCart();
      },
      error: () => {
        this.snackBar.open('Error during checkout', '', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
