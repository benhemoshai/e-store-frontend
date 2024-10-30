import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product/product-list/product-list.component';
import { CartViewComponent } from './cart/cart-view/cart-view.component';
import { ProductComponent } from './product/product/product.component';
import { ReviewComponent } from './review/review.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent

 } from './auth/login/login.component';
const routes: Routes = [
  {path:'', redirectTo: '/products', pathMatch: 'full'},
  {path: 'products', component: ProductListComponent},
  {path: 'cart', component: CartViewComponent},
  {path: 'products/:id', component: ProductComponent},
  {path: 'products/:id/reviews', component: ReviewComponent},
  {path: 'auth/register', component: RegisterComponent},
  {path: 'auth/login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
