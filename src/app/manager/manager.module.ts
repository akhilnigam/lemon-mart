import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { Route, Routes } from '@angular/router'

import { AppMaterialModule } from '../app.material.module'
import { ManagerHomeComponent } from './manager-home/manager-home.component'
import { ManagerRoutingModule } from './manager-routing.module'
import { ManagerComponent } from './manager.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ReceiptLookupComponent } from './receipt-lookup/receipt-lookup.component'

//export const managerRoutes: Routes = [{ path: '', component: ManagerHomeComponent }]

@NgModule({
  declarations: [ManagerHomeComponent, ManagerComponent, UserManagementComponent, ReceiptLookupComponent],
  imports: [CommonModule, ManagerRoutingModule, AppMaterialModule],
})
export class ManagerModule {}
