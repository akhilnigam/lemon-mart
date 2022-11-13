import { Injectable } from '@angular/core'
import { throwToolbarMixedModesError } from '@angular/material/toolbar'
import { sign } from 'fake-jwt-sign'
import decode from 'jwt-decode'
import { Observable, of, throwError } from 'rxjs'

import { PhoneType, User } from '../user/user/user'
import { Role } from './auth.enum'
import { AuthService, IAuthStatus, IServerAuthResponse } from './auth.service'

@Injectable()
export class InMemoryAuthService extends AuthService {
  private defaultUser = User.Build({
    _id: '5da01751da27cc462d265913',
    email: 'duluca@gmail.com',
    name: { first: 'Doguhan', last: 'Uluca' },
    picture: 'https://secure.gravatar.com/avatar/7cbaa9afb5ca78d97f3c689f8ce6c985',
    role: Role.Manager,
    dateOfBirth: new Date(1980, 1, 1),
    userStatus: true,
    address: {
      line1: '101 Sesame St.',
      city: 'Bethesda',
      state: 'Maryland',
      zip: '20810',
    },
    level: 2,
    phones: [
      {
        id: 0,
        type: PhoneType.Mobile,
        digits: '5555550717',
      },
    ],
  })

  constructor() {
    console.log('In-Memory class constructor')
    super()
  }

  protected authProvider(
    email: string,
    password: string
  ): Observable<IServerAuthResponse> {
    email = email.toLowerCase()
    if (!email.endsWith('@test.com')) {
      console.log('Invalid User')
      throwError('Invalid User ID')
      //console.log('NOT CALLED')
    }

    const authstatus = {
      isAuthenticated: true,
      userRole: email.includes('cashier')
        ? Role.Cashier
        : email.includes('clerk')
        ? Role.Cashier
        : email.includes('manager')
        ? Role.Manager
        : Role.None,
      userId: this.defaultUser._id,
    } as IAuthStatus

    this.defaultUser.role = authstatus.userRole
    const authResponse = {
      accessToken: sign(authstatus, 'secret', {
        expiresIn: '60',
        algorithm: 'none',
      }),
      expiresIn: 600,
    } as IServerAuthResponse

    return of(authResponse)
  }

  protected transformJwtToken(token: string): IAuthStatus {
    return decode(token) as IAuthStatus
  }

  protected getCurrentUser(): Observable<User> {
    return of(this.defaultUser)
  }
}
