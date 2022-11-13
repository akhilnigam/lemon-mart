import { NgModule } from '@angular/core'
import { enableDebugTools } from '@angular/platform-browser'
import { RouterModule, Routes } from '@angular/router'

import { HomeComponent } from './home/home.component'
import { LoginComponent } from './login/login.component'
//import { ManagerHomeComponent } from './manager/manager-home/manager-home.component'
//import { managerRoutes } from './manager/manager.module'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { PosComponent } from './pos/pos.component'

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  //{ path: '404/:id', component: PageNotFoundComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/:redireUrl', component: LoginComponent },
  {
    path: 'manager',
    loadChildren: () => import('./manager/manager.module').then((m) => m.ManagerModule),
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'inventory',
    loadChildren: () =>
      import('./inventory/inventory.module').then((m) => m.InventoryModule),
  },
  {
    path: 'pos',
    //component: PosComponent,
    loadChildren: () => import('./pos/pos.module').then((m) => m.PosModule),
  },
  { path: '**', component: PageNotFoundComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
