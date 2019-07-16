import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';


@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {}

  head(url: string, params?: HttpParams, options?: any): Observable<any> {
    options = this.prepareOptions(options);
    options.params = params;
    return this.http.head(url, options);
  }

  get(url: string, params?: HttpParams, options?: any): Observable<any> {
    options = this.prepareOptions(options);
    options.params = params;
    return this.http.get(url, options);
  }

  delete(url: string, params?: HttpParams, options?: any): Observable<any> {
    options = this.prepareOptions(options);
    options.params = params;
    return this.http.delete(url, options);
  }

  post(url: string, body: any|null, options?: any): Observable<any> {
    options = this.prepareOptions(options);
    return this.http.post(url, body, options);
  }

  put(url: string, body: any|null, options?: any): Observable<any> {
    options = this.prepareOptions(options);
    return this.http.put(url, body, options);
  }

  patch(url: string, body?: any, options?: any): Observable<any> {
    options = this.prepareOptions(options);
    return this.http.patch(url, body, options);
  }

  prepareOptions(options?: any): any {
    options = options || {};
    options.observe = 'response';
    options.headers = options.headers || new HttpHeaders();
    options.headers = options.headers.set('Accept', 'application/json');
    return options
  }

  parsePaginationLink(link?: string): any {
    if (link) {
      const linkRe = /<([^>]+)>; rel="([^"]+)"/g;
      const pageRe = /(?:\?|&)page=(\d)+/;
      const urls = {};
      let m;
      while ((m = linkRe.exec(link)) !== null) {
        let url = m[1];
        if (!isDevMode()) {
          //// workaround for broken links- django returns http:// instead of https:// in prod
          //// causing mixed-mode content blocking errors
          url = url.replace('http://', 'https://');
        }
        urls[m[2]] = url;
      }
      return urls;
    } else {
      return {};
    }
  }

  users = {
    me: (params?: HttpParams): Observable<any> => {
      return this.get('/api/users/me/', params);
    },
    index: (params?: HttpParams): Observable<any> => {
      return this.get('/api/users/', params);
    },
    get: (id: string, params?: HttpParams): Observable<any> => {
      return this.get(`/api/users/${id}`, params);
    },
    update: (id: string, data: any): Observable<any> => {
      return this.patch(`/api/users/${id}`, data);
    },
  };
}
