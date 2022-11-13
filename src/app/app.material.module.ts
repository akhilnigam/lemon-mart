import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTooltipModule } from '@angular/material/tooltip'

import { AuthHttpInterceptor } from './auth/auth-http-interceptor'

const modules = [
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatToolbarModule,
  MatTooltipModule,
  MatCardModule,
]

@NgModule({
  declarations: [],
  imports: [
    //CommonModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor, //AuthHttpInterceptor,
      multi: true,
    },
  ],
  exports: modules,
})
export class AppMaterialModule {}
