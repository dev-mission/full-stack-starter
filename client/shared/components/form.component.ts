import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ApiService, UserService } from '../services';

import { empty } from 'rxjs';
import { catchError } from 'rxjs/operators';
import clone from 'lodash/clone';

@Component({
  selector: 'app-shared-form',
  templateUrl: './form.component.html'
})
export class FormComponent {
  @Input() id: string = null;
  @Input() type: string;
  @Input() record: any = {};
  @Input() hideButtons = false;
  @Input() createLabel: string = "Create";
  @Input() updateLabel: string = "Update";
  @Output() create = new EventEmitter<any>();
  @Output() update = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @ContentChild(TemplateRef) template: TemplateRef<any>;

  loading = false;
  updated = false;
  error = false;

  constructor(protected api: ApiService, protected currentUser: UserService) { }

  ngOnInit() {
    if (this.id) {
      this.loading = true;
      this.api[this.type].get(this.id)
        .pipe(catchError((response: HttpErrorResponse) => {
          this.error = response.error;
          this.loading = false;
          return empty();
        }))
        .subscribe((response: HttpResponse<any>) => {
          this.loading = false;
          this.record = response.body;
        });
    }
  }

  onSubmit() {
    this.loading = true;
    this.updated = false;
    this.error = false
    if (this.id) {
      this.api[this.type].update(this.id, this.record)
        .pipe(catchError((response: HttpErrorResponse) => {
          this.error = response.error;
          this.loading = false;
          return empty();
        }))
        .subscribe((response: HttpResponse<any>) => {
          this.loading = false;
          this.updated = true;
          this.record = response.body;
          this.update.emit(response.body);
        });
    } else {
      this.api[this.type].create(this.record)
        .pipe(catchError((response: HttpErrorResponse) => {
          this.error = response.error;
          this.loading = false;
          return empty();
        }))
        .subscribe((response: HttpResponse<any>) => {
          this.loading = false;
          this.create.emit(response.body);
        });
    }
    return false;
  }

  onDelete() {
    this.loading = true;
    this.error = false;
    this.api[this.type].delete(this.id)
      .pipe(catchError((response: HttpErrorResponse) => {
        this.error = response.error;
        this.loading = false;
        return empty();
      }))
      .subscribe((response: HttpResponse<any>) => {
        this.loading = false;
        this.delete.emit(response.body);
      });
  }
}
