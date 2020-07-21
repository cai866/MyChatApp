import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StreamsRoutingModule } from './streams-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { StreamsComponent } from './streams.component';


@NgModule({
  declarations: [StreamsComponent],
  imports: [
    CommonModule,
    StreamsRoutingModule,
    SharedModule
  ]
})
export class StreamsModule { }
