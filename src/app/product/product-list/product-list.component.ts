import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../../models/product';
import { Router } from '@angular/router'; // Import Router


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{

  products: Product[] = [];
  filteredProducts : Product [] = [];
  sortOrder : string = ""; 

constructor(private productService: ProductService, 
  private router: Router){
}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = data;
    })
   }

   goToProduct(productId: string): void {
    this.router.navigate(['/products', productId]); // Navigate to product page with ID
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
