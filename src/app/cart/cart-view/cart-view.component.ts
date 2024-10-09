import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { CartItem } from '../../models/cart-item.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.css'] // Fixed typo from `styleUrl` to `styleUrls`
})
export class CartViewComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe(data => {
      this.cartItems = data;
      this.totalPrice = this.getTotalPrice();
    });
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => 
      total + item.product.price * (item.quantity || 1), 0);
  }

  removeItem(item: CartItem): void {
    if (!item.product || !item.product._id) {
      console.error('Invalid cart item:', item);
      this.snackBar.open('Error: Invalid cart item', '', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
      return;
    }

    this.cartService.removeFromCart(item.product._id).subscribe({
      next: () => {
        this.loadCartItems(); // Reload cart items after removal
        this.snackBar.open('Item removed from cart', '', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        console.error('Error removing item from cart', error);
        this.snackBar.open('Error removing item from cart', '', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe(() => {
      this.cartItems = [];
      this.totalPrice = 0;
    });
  }

  incrementQuantity(item: CartItem): void {
    item.quantity++;
    this.cartService.updateCartItem(item).subscribe({
      next: () => {
        this.totalPrice = this.getTotalPrice(); // Update total price
        this.snackBar.open('Item quantity updated', '', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        console.error('Error updating item quantity', error);
        this.snackBar.open('Error updating item quantity', '', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.updateCartItem(item).subscribe({
        next: () => {
          this.totalPrice = this.getTotalPrice(); // Update total price
          this.snackBar.open('Item quantity updated', '', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        },
        error: (error) => {
          console.error('Error updating item quantity', error);
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
    this.cartService.checkOut(this.cartItems).subscribe(() => {
      this.snackBar.open('Checkout complete', '', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
      this.clearCart(); // Clear cart after successful checkout
    });
  }
}
