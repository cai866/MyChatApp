import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageRoutingModule } from './message-routing.module';
import { MessageComponent } from './message.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [MessageComponent],
  imports: [
    CommonModule,
    MessageRoutingModule,
    SharedModule
  ]
})
export class MessageModule { }
