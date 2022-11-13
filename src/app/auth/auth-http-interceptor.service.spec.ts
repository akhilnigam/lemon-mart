import { TestBed } from '@angular/core/testing'

import { AuthHttpInterceptorService } from './auth-http-interceptor'

describe('AuthHttpInterceptorService', () => {
  let service: AuthHttpInterceptorService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(AuthHttpInterceptorService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
