import { HttpErrorResponse } from '@angular/common/http'
import { throwError } from 'rxjs'

export function transformError(error: HttpErrorResponse | string) {
  console.log(`transformError called: ${error}`)
  let errorMessage = 'Unknown error occured'
  if (typeof error === 'string') {
    errorMessage = error
  } else if (error.error instanceof ErrorEvent) {
    errorMessage = `ERROR: ${error.error.message}`
  } else if (error.status) {
    errorMessage = `ERROR: Request failed with ${error.status} ${error.statusText}`
  } else if (error instanceof Error) {
    errorMessage = error.message
  }
  return throwError(errorMessage)
}
