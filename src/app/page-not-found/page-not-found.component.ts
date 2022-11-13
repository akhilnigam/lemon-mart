import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-page-not-found',
  template: `
    <p>
      The page {{ id }} does not exist. Go back to <a routerLink="/home">Home</a> -
      <a routerLink="/404/78">Navigation test</a>
    </p>
  `,
  styles: [],
})
export class PageNotFoundComponent implements OnInit {
  id: any

  constructor(private activeRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((param) => (this.id = param.get('id')))
  }
}
