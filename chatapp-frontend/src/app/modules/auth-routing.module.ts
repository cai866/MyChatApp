import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthTabsComponent } from '../components/auth-tabs/auth-tabs.component';

const routes: Routes = [{
  path: '',
  component: AuthTabsComponent
}];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class AuthRoutingModule { }
