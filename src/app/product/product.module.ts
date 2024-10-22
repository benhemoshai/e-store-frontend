import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list/product-list.component';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { ProductComponent } from './product/product.component';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ReviewModule } from '../review/review.module';



@NgModule({
  declarations: [
    ProductListComponent,
    ProductComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatSnackBarModule,
    MatInputModule,
    MatSelectModule,
    MatButton,
    RouterLink,
    ReviewModule
  ]
})
export class ProductModule { }
