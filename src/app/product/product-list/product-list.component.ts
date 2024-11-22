import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../../models/product';
import { Router } from '@angular/router'; // Import Router
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{

  products: Product[] = [];
  filteredProducts : Product [] = [];
  sortOrder : string = ""; 
  isAdmin: boolean = false;

constructor(private productService: ProductService, private authService: AuthService,
  private router: Router){
}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = data;
    });

    this.authService.currentUser$.subscribe((user) => {
      this.isAdmin = user?.role === 'admin';
    });
   }

   deleteProduct(productId: string): void {
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        alert('Product deleted successfully!');
        // Update the product lists by filtering out the deleted product
        this.products = this.products.filter(product => product._id !== productId);
        this.filteredProducts = this.filteredProducts.filter(product => product._id !== productId);
      },
      error: (error) => console.error('Error deleting product:', error),
    });
  }
  
  
   applyFilter(event: Event) : void {
    let searchTerm = (event.target as HTMLInputElement).value;
    searchTerm = searchTerm.toLowerCase();

    this.filteredProducts = this.products.filter(
      product => product.name.toLowerCase().includes(searchTerm)
    )

    this.sortProducts(this.sortOrder);
   }

   sortProducts(sortValue: string): void {
    this.sortOrder = sortValue;

    if (this.sortOrder === "priceLowHigh"){
      this.filteredProducts.sort((a,b) => a.price - b.price);
    } else if(this.sortOrder === "priceHighLow"){
      this.filteredProducts.sort((a,b) => b.price - a.price);
    }
   }
}
