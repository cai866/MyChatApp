import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommentsRoutingModule } from './comments-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CommentsComponent } from './comments.component';


@NgModule({
  declarations: [CommentsComponent],
  imports: [
    CommonModule,
    CommentsRoutingModule,
    SharedModule
  ]
})
export class CommentsModule { }
