//import { Component, OnInit } from '@angular/core'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { MediaObserver } from '@angular/flex-layout'
import { MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser'
import { combineLatest } from 'rxjs'
import { tap } from 'rxjs/operators'

import { AuthService } from './auth/auth.service'
//import { SubSink } from 'subsink'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  //private subs = new SubSink()
  opened!: boolean

  title = 'lemon-mart'
  userName = ''
  constructor(private authservice: AuthService, public media: MediaObserver) {}

  ngOnInit(): void {
    this.authservice.currentUser$.subscribe(
      (user) => (this.userName = user.fullName ?? '')
    )
  }

  /*
  ngOnInit() {
    this.subs.sink = combineLatest([
      this.media.asObservable(),
      this.authservice.authStatus$,
    ])
      .pipe(
        tap(([mediaValue, authStatus]) => {
          if (!authStatus?.isAuthenticated) {
            this.opened = false
          } else {
            if (mediaValue[0].mqAlias === 'xs') {
              this.opened = false
            } else {
              this.opened = true
            }
          }
        })
      )
      .subscribe()
  }
*/
  ngOnDestroy() {
    //this.subs.unsubscribe()
    this.authservice.currentUser$.unsubscribe()
  }
}
