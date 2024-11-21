import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent {
  product = {_id: '',  name: '', description: '', price: 0, image_url: '' };

  constructor(private productService: ProductService, private router: Router) {}

  addProduct(): void {
    this.productService.addProduct(this.product).subscribe({
      next: () => {
        alert('Product added successfully!');
        this.router.navigate(['/products']);
      },
      error: (error) => console.error('Error adding product:', error),
    });
  }
}
