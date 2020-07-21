import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FollowingComponent} from './following.component';

const routes: Routes = [
  {
    path: '',
    component: FollowingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FollowingRoutingModule { }
