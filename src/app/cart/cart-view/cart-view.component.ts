import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../cart.service';
import { CartItem } from '../../models/cart-item.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.css']
})
export class CartViewComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  userId: string | null = null;
  userSubscription: Subscription | undefined;

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Subscribe to currentUser$ to get user ID
    this.userSubscription = this.authService.currentUser$.subscribe((user: User | null) => {
      this.userId = user ? user._id : null;
      if (this.userId) {
        this.loadCartItems();
      }
    });
  }

  loadCartItems(): void {
    if (this.userId) {
      this.cartService.getCartItems(this.userId).subscribe(data => {
        this.cartItems = data;
        this.totalPrice = this.getTotalPrice();
      });
    }
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => 
      total + item.product.price * (item.quantity || 1), 0);
  }

  removeItem(item: CartItem): void {
    if (this.userId && item.product?._id) {
      this.cartService.removeFromCart(this.userId, item.product._id).subscribe({
        next: () => {
          this.loadCartItems();
          this.snackBar.open('Item removed from cart', '', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        },
        error: () => {
          this.snackBar.open('Error removing item from cart', '', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  clearCart(): void {
    if (this.userId) {
      this.cartService.clearCart(this.userId).subscribe(() => {
        this.cartItems = [];
        this.totalPrice = 0;
      });
    }
  }

  incrementQuantity(item: CartItem): void {
    if (this.userId) {
      item.quantity++;
      this.cartService.updateCartItem(this.userId, item).subscribe({
        next: () => {
          this.totalPrice = this.getTotalPrice();
          this.snackBar.open('Item quantity updated', '', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        },
        error: () => {
          this.snackBar.open('Error updating item quantity', '', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  decrementQuantity(item: CartItem): void {
    if (this.userId && item.quantity > 1) {
      item.quantity--;
      this.cartService.updateCartItem(this.userId, item).subscribe({
        next: () => {
          this.totalPrice = this.getTotalPrice();
          this.snackBar.open('Item quantity updated', '', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        },
        error: () => {
          this.snackBar.open('Error updating item quantity', '', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  checkOut(): void {
    if (this.userId) {
      this.cartService.checkOut(this.userId, this.cartItems).subscribe(() => {
        this.snackBar.open('Checkout complete', '', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.clearCart();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
