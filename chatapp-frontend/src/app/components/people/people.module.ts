import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeopleRoutingModule } from './people-routing.module';
import {PeopleComponent} from './people.component';

@NgModule({
  declarations: [PeopleComponent],
  imports: [
    CommonModule,
    PeopleRoutingModule,
    PeopleRoutingModule
  ]
})
export class PeopleModule { }
