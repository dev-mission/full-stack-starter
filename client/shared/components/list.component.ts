import { Component, ContentChild, ElementRef, Injectable, Input, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, NavigationEnd } from '@angular/router';

import { Observable, Subscription, empty } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import assign from 'lodash/assign';
import clone from 'lodash/clone';
import remove from 'lodash/remove';

import { ApiService, NavigationService, UserService } from '..//services';

@Component({
  selector: 'app-shared-list',
  templateUrl: './list.component.html'
})
export class ListComponent {
  @Input() type: string = null;
  @Input() basePath: string = null;
  @Input() params: HttpParams = null;
  @Input() query: string = null;
  @ContentChild(TemplateRef) template: TemplateRef<any>;
  @ViewChild('search') searchInput: ElementRef = null;

  records: any[] = null;
  paginationLink: string = null;
  isLoading = true;

  apiSubscription: Subscription;
  routerSubscription: Subscription;

  constructor(protected api: ApiService, protected currentUser: UserService, protected navigation: NavigationService, protected route: ActivatedRoute) { }

  ngOnInit() {
    if (!this.basePath) {
      this.basePath = `/${this.type}`;
    }
    this.routerSubscription = this.navigation.getRouter().events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url.endsWith(this.basePath)) {
          let prevUrl = this.navigation.getPreviousUrl();
          let match = prevUrl.match(`${this.basePath.replace('/', '\/')}\/([^\/]+)`);
          if (match) {
            let id = match[1];
            if (id == 'new' || id =='publish') {
              this.refresh();
            } else if (id.match(/\d+/)) {
              this.refreshRecord(id);
            }
          }
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.refresh();
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }
  }

  refresh() {
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }
    this.records = [];
    this.isLoading = true;
    this.paginationLink = null;
    let params = this.params;
    if (this.query != null) {
      if (params == null) {
        params = new HttpParams()
      }
      params = params.set('search', this.query)
    }
    this.apiSubscription = this.api[this.type].index(params).subscribe((response: HttpResponse<any>) => this.handleResponse(response));
  }

  refreshRecord(id: string) {
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }
    this.apiSubscription = this.api[this.type].get(id)
      .pipe(catchError((response: HttpErrorResponse) => {
        if (response.status == 404) {
          //// deleted, remove from list
          let records = clone(this.records);
          remove(records, function(r) { return r.id == id; });
          this.records = records;
        }
        return empty();
      }))
      .subscribe((response: HttpResponse<any>) => {
        let found = false;
        for (let record of this.records) {
          if (record.id == id) {
            assign(record, response.body);
            found = true;
            break;
          }
        }
        if (!found) {
          this.refresh();
        }
      });
  }

  private handleResponse(response: HttpResponse<any>) {
    this.isLoading = false;
    if (this.records == null) {
      this.records = response.body;
    } else {
      this.records = this.records.concat(response.body);
    }
    this.paginationLink = this.api.parsePaginationLink(response.headers.get('Link')).next;
  }

  trackById(record: any, index: number): string {
    return record.id;
  }

  private onLoadMore(paginationLink: string) {
    this.isLoading = true;
    this.paginationLink = null;
    this.api.get(paginationLink).subscribe(response => this.handleResponse(response));
  }
}
