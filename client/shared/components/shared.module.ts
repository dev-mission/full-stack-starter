import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SortablejsModule } from 'angular-sortablejs';

import { ArrayComponent, AutoloadDirective, ErrorComponent, FormComponent,
  ListComponent, LoaderComponent, ModalComponent, UploaderComponent } from '.';

@NgModule({
  declarations: [
    ArrayComponent,
    AutoloadDirective,
    ErrorComponent,
    FormComponent,
    ListComponent,
    LoaderComponent,
    ModalComponent,
    UploaderComponent,
  ],
  exports: [
    ArrayComponent,
    AutoloadDirective,
    ErrorComponent,
    FormComponent,
    ListComponent,
    LoaderComponent,
    ModalComponent,
    UploaderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    SortablejsModule,
  ],
  providers: []
})
export class SharedComponentsModule {}
