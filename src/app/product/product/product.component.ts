import { Component, OnInit } from '@angular/core'; // Import OnInit
import { ProductService } from '../product.service';
import { Product } from '../../models/product';
import { CartService } from '../../cart/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute for getting ID
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'] // Fixed to styleUrls
})
export class ProductComponent implements OnInit {
  product!: Product; // The product to display
  productId!: string; // The product ID

  constructor(
    private productService: ProductService, 
    private cartService: CartService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute // Inject ActivatedRoute to get the product ID
  ) {}

  ngOnInit(): void {
    // Retrieve the product ID from the route parameters
    this.productId = this.route.snapshot.paramMap.get('id')!; // Assume you want to get the ID from route

    // Fetch the product details using the product ID
    this.productService.getProduct(this.productId).subscribe(data => {
      this.product = data; // Assign the fetched product to the component property
    });
  }

  addToCart(product: Product): void {
    if (!product || !product._id) {
      console.error('Invalid product', product);
      return;
    }
  
    this.cartService.getCartItems().subscribe({
      next: (cartItems) => {
        const existingCartItem = cartItems.find(item => 
          item.product && item.product._id === product._id
        );
  
        if (existingCartItem) {
          existingCartItem.quantity = (existingCartItem.quantity || 0) + 1;
          this.cartService.updateCartItem(existingCartItem).subscribe({
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
          this.cartService.addToCart(newCartItem).subscribe({
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
