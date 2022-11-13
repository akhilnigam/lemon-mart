import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http'
import { NgModule, OnInit } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AppMaterialModule } from './app.material.module'
import { AuthHttpInterceptor } from './auth/auth-http-interceptor'
import { InMemoryAuthService } from './auth/auth.inmemory.service'
import { AuthService } from './auth/auth.service'
import { HomeComponent } from './home/home.component'
import { LoginComponent } from './login/login.component'
//import { InventoryModule } from './inventory/inventory.module'
//import { ManagerModule } from './manager/manager.module'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'

//import { PosModule } from './pos/pos.module'
//import { UserModule } from './user/user.module'

@NgModule({
  declarations: [AppComponent, HomeComponent, PageNotFoundComponent, LoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppMaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    //ManagerModule, removed for Lazy loading implementation.
    //InventoryModule,
    //PosModule,
    //UserModule, removed for Lazy loading implementation.
  ],
  providers: [
    {
      provide: AuthService,
      useClass: InMemoryAuthService,
      //useFactory: authFactory,
      //deps: [AngularFireAuth, HttpClient],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
