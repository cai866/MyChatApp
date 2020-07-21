import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';

import { AuthTabsComponent } from './../components/auth-tabs/auth-tabs.component';
import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';
import { AuthService } from '../services/auth.service';

@NgModule({
  declarations: [ AuthTabsComponent, LoginComponent, SignupComponent ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AuthService]
})
export class AuthModule { }
