import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { catchError, combineLatest, filter, first, tap } from 'rxjs'
import { SubSink } from 'subsink'

import { AuthService } from '../auth/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private subs = new SubSink()
  loginForm!: FormGroup
  redirecturl!: string
  loginError = ''

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authservice: AuthService
  ) {
    this.subs.sink = route.paramMap.subscribe(
      (params) => (this.redirecturl = params.get('redirectUrl') ?? '')
    )
  }

  ngOnInit(): void {
    this.authservice.logout()
    this.buildLoginForm()
  }
  ngOnDestroy() {
    this.subs.unsubscribe()
  }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required, Validators.email],
      password: [
        '',
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
      ],
    })
  }

  login(submittedForm: FormGroup) {
    //console.log('suth service call starts')
    this.authservice
      .login(submittedForm.value.email, submittedForm.value.password)
      .pipe(catchError((err) => (this.loginError = err)))
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
          this.router.navigate([this.redirecturl || '/manager'])
        })
      )
      .subscribe()
  }
}
