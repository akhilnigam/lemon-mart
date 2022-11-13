import { TestBed } from '@angular/core/testing'

import { InMemoryAuthService } from './auth.inmemory.service'

describe('InMemoryAuthService', () => {
  let service: InMemoryAuthService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(InMemoryAuthService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
