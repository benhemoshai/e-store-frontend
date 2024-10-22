import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from './review.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ReviewComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ], 
  exports: [ // Add this export
    ReviewComponent
  ]
})
export class ReviewModule { }
