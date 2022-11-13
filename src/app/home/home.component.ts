import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { combineLatest, filter, first, forkJoin, last, tap } from 'rxjs'

import { AuthService } from '../auth/auth.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
    `
      div[fxLayout] {
        margin-top: 32px;
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  constructor(private authservice: AuthService, private router: Router) {}

  login() {
    //console.log('suth service call starts')
    this.authservice.login('Manager@test.com', 'mypassword')
    //console.log('suth service call ends')

    combineLatest([this.authservice.authStatus$, this.authservice.currentUser$])
      .pipe(
        /*tap(([status, user]) => {
          console.log(
            `status: ${status.userId} ${status.userRole} ${status.isAuthenticated}`
          )
          console.log(`user: ${user._id} ${user.email}`)
          this.router.navigate(['/manager'])
        }),*/
        //multiple subscriptions would get added everytime login is called.
        //to solve it, use first()
        first(),
        filter(([status, user]) => status.isAuthenticated && user._id !== ''),
        tap(([status, user]) => {
          //console.log(`status: ${status.userId} ${status.userRole} ${status.isAuthenticated}`)
          //console.log(`user: ${user._id} ${user.email}`)
          this.router.navigate(['/manager'])
        })
      )
      .subscribe()
  }
  ngOnInit(): void {}
}
