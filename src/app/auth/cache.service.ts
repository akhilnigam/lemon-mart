import { NgTemplateOutlet } from '@angular/common'
import decode from 'jwt-decode'

export abstract class CacheService {
  protected getItem<T>(key: string): T | null {
    const data = localStorage.getItem(key)
    if (data != null) {
      //const temp = JSON.parse(atob(data.split('.')[0])).exp
      return JSON.parse(data) //decode(data)
    }
    return null
  }

  //protected setItem(key: string, value: object | string): void {
  protected setItem(key: string, value: string): void {
    /*if (typeof value === 'string') {
      localStorage.setItem(key, value)
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }*/
    localStorage.setItem(key, JSON.stringify(value))
  }

  protected removeItem(key: string): void {
    localStorage.removeItem(key)
  }

  protected clear(): void {
    localStorage.clear()
  }
}
