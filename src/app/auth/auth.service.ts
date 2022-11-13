import { Injectable, TestabilityRegistry } from '@angular/core'
import { ɵassignExtraOptionsToRouter } from '@angular/router'
import decode from 'jwt-decode'
//import * as moment from 'moment'
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  flatMap,
  map,
  mergeMap,
  pipe,
  tap,
  throwError,
} from 'rxjs'

import { transformError } from '../common/common'
import { IUser, User } from '../user/user/user'
import { Role } from './auth.enum'
import { CacheService } from './cache.service'

export interface IServerAuthResponse {
  accessToken: string
  expiresIn: number
}

export interface IAuthStatus {
  isAuthenticated: boolean
  userRole: Role
  userId: string
}

export interface IAuthService {
  readonly authStatus$: BehaviorSubject<IAuthStatus>
  readonly currentUser$: BehaviorSubject<IUser>
  login(email: string, password: string): Observable<void>
  logout(clearToken?: boolean): void
  getToken(): string
}

@Injectable()
export abstract class AuthService extends CacheService implements IAuthService {
  constructor() {
    super()
    //called on page refresh or App start:
    console.log('AuthService-constructor() called...')
    if (this.hasExpiredToken()) {
      console.log('token expired')
      this.logout(true)
    } else {
      //on page refresh, if token is not expired, update suthstatus and
      //check isAuthenticated value before setting user object.
      this.authStatus$.next(this.getAuthStatusFromToken())
      setTimeout(() => this.resumeCurrentUser$.subscribe(), 0)
    }
  }

  defaultAuthStatus: IAuthStatus = {
    isAuthenticated: false,
    userId: '',
    userRole: Role.None,
  }

  readonly authStatus$ = new BehaviorSubject<IAuthStatus>(
    this.getItem('authStatus') ?? this.defaultAuthStatus
  )
  readonly currentUser$ = new BehaviorSubject<IUser>(new User())

  private getAndUpdateUserIfAuthenticated = pipe(
    filter((status: IAuthStatus) => status.isAuthenticated),
    mergeMap(() => this.getCurrentUser()),
    map((user: IUser) => {
      //console.log(`user: ${user.role}`)
      this.currentUser$.next(user)
    }),
    catchError(transformError)
  )

  protected readonly resumeCurrentUser$ = this.authStatus$.pipe(
    this.getAndUpdateUserIfAuthenticated
  )

  login(email: string, password: string): Observable<void> {
    //first remove token from localStorge
    this.removeToken()

    const loginResponse$ = this.authProvider(email, password).pipe(
      map((serverResponse) => {
        this.setToken(serverResponse)
        return this.getAuthStatusFromToken()
      }),
      tap((authstatus) => {
        //console.log(`isAuthenticated? : ${authstatus.isAuthenticated}`)
        this.authStatus$.next(authstatus)
      }),
      this.getAndUpdateUserIfAuthenticated
    )
    /*
    const loginResponse2$ = this.authProvider(email, password).pipe(
      map((serverResponse: IServerAuthResponse) => {
        //save received token:
        this.setToken(serverResponse.accessToken)
        return this.transformJwtToken(decode(this.getToken()))
        //return this.transformJwtToken(serverResponse.accessToken)
      }),
      tap((authstatus) => {
        console.log(authstatus)
        this.authStatus$.next(authstatus)
      }),
      filter((authstatus) => !authstatus.isAuthenticated),
      flatMap(() => this.getCurrentUser()),
      map((user) => this.currentUser$.next(user)),
      catchError(transformError)
    )*/

    loginResponse$.subscribe({
      error: (err) => {
        this.logout()
        return throwError(err)
      },
    })
    return loginResponse$
  }

  logout(clearToken?: boolean | undefined): void {
    console.log('logout called-')
    if (clearToken) {
      this.removeToken()
    }
    setTimeout(() => this.authStatus$.next(this.defaultAuthStatus), 0)
    setTimeout(() => this.currentUser$.next(new User()), 0)
  }

  getToken(): string {
    const temp = this.getItem<string>('jwt') ?? ''
    return temp //decode(temp)
  }
  protected hasExpiredToken(): boolean {
    const expireTime = this.getExpirationTime()

    if (expireTime) {
      const isExpired = (Date.now() >= expireTime) as boolean
      return isExpired
    }
    return true
  }
  getExpirationTime(): number {
    const temp = this.getItem<string>('expiresIn') ?? ''
    return +temp //string to number OR use parseInt()
  }

  protected setToken(token: IServerAuthResponse): void {
    this.setItem('jwt', token.accessToken)
    const timeLeft = JSON.parse(atob(token.accessToken.split('.')[0])).expiresIn
    const expiresAt = new Date().getTime() + timeLeft * 1000
    this.setItem('expiresIn', expiresAt.toString())
  }

  protected removeToken(): void {
    this.removeItem('jwt')
    this.removeItem('expiresIn')
  }

  protected abstract authProvider(
    email: string,
    password: string
  ): Observable<IServerAuthResponse>

  protected abstract transformJwtToken(token: unknown): IAuthStatus
  protected abstract getCurrentUser(): Observable<User>

  protected getAuthStatusFromToken(): IAuthStatus {
    return this.transformJwtToken(this.getToken())
  }
}
