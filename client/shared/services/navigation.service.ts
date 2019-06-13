import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Injectable()
export class NavigationService {
  private currentUrl: string;
  private previousUrl: string;

  constructor(private location: Location, private router: Router, private route: ActivatedRoute, private title: Title) {
    //// keep track of the current and previous url
    router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      });
    //// update Title from route data
    router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.route),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        if (data['title']) {
          this.setTitle(data['title']);
        }
      });
  }

  getRouter() {
    return this.router;
  }

  setTitle(title: string) {
    this.title.setTitle(`${title} - Hanuman Webtool`);
  }

  getCurrentUrl(): string {
    return this.currentUrl;
  }

  getPreviousUrl(): string {
    return this.previousUrl;
  }

  goTo(url: string, queryParams: any) {
    if (queryParams) {
      this.router.navigate([url], {queryParams: queryParams});
    } else {
      this.router.navigate([url]);
    }
  }

  backTo(url: string) {
    if (this.previousUrl == url) {
      this.location.back();
    } else {
      this.router.navigate([url]);
    }
  }

  replaceWith(url: any) {
    this.router.navigate([url], {replaceUrl: true});
  }
}
