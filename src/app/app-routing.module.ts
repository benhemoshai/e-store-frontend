import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product/product-list/product-list.component';
import { CartViewComponent } from './cart/cart-view/cart-view.component';
import { ProductComponent } from './product/product/product.component';

const routes: Routes = [
  {path:'', redirectTo: '/products', pathMatch: 'full'},
  {path: 'products', component: ProductListComponent},
  {path: 'cart', component: CartViewComponent},
  {path: 'products/:id', component: ProductComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
