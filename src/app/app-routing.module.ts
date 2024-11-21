import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product/product-list/product-list.component';
import { CartViewComponent } from './cart/cart-view/cart-view.component';
import { ProductComponent } from './product/product/product.component';
import { ReviewComponent } from './review/review.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent} from './auth/login/login.component';
import { AddProductComponent } from './product/add-product/add-product.component';
import { EditProductComponent } from './product/edit-product/edit-product.component';
import { RoleGuard } from './guards/role.guard';
const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  {path: 'products/:id', component: ProductComponent},
  { path: 'cart', component: CartViewComponent },
  { path: 'admin/products/add', component: AddProductComponent, canActivate: [RoleGuard] }, // Add Product
  { path: 'admin/products/:id/edit', component: EditProductComponent, canActivate: [RoleGuard] }, // Edit Product
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
