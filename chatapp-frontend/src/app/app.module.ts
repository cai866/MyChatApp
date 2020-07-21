import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//import { AuthModule } from './modules/auth.module';
import { AppComponent } from './app.component';
//import { AuthRoutingModule } from './modules/auth-routing.module';
import {StreamsModule} from './modules/streams.module';
import { StreamsRoutingModule } from './modules/streams-routing.module';
import {CookieService} from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {TokenInterceptor} from './services/token-interceptor';
import {AppRoutingModule} from './app-routing.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [
    CookieService
    /*{
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
