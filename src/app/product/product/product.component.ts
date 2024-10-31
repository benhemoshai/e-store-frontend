import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../../models/product';
import { CartService } from '../../cart/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product!: Product;
  productId!: string;
  userId!: string; // New property to store the user ID
  showReviews = false;

  constructor(
    private productService: ProductService, 
    private cartService: CartService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute 
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.userId = this.route.snapshot.paramMap.get('userId')!; // Assume userID is obtained from route or a service

    this.productService.getProduct(this.productId).subscribe(data => {
      this.product = data;
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
  
    this.cartService.getCartItems(this.userId).subscribe({
      next: (cartItems) => {
        const existingCartItem = cartItems.find(item => 
          item.product && item.product._id === product._id
        );
  
        if (existingCartItem) {
          existingCartItem.quantity = (existingCartItem.quantity || 0) + 1;
          this.cartService.updateCartItem(this.userId, existingCartItem).subscribe({
            next: () => {
              this.snackbar.open("Updated Quantity in Cart", "", {
                horizontalPosition: "right",
                verticalPosition: "top",
                duration: 2000
              });
            },
            error: (error) => console.error('Error updating cart item', error)
          });
        } else {
          const newCartItem = new CartItem(product, 1);
          this.cartService.addToCart(this.userId, newCartItem).subscribe({
            next: () => {
              this.snackbar.open("Added To Cart", "", {
                horizontalPosition: "right",
                verticalPosition: "top",
                duration: 2000
              });
            },
            error: (error) => console.error('Error adding to cart', error)
          });
        }
      },
      error: (error) => console.error('Error fetching cart items', error)
    });
  }
}
