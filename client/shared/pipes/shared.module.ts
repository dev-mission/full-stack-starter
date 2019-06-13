import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ErrorPipe, PhonePipe } from '.';

@NgModule({
  declarations: [
    ErrorPipe,
    PhonePipe,
  ],
  exports: [
    ErrorPipe,
    PhonePipe,
  ],
  imports: [
    CommonModule,
  ],
  providers: []
})
export class SharedPipesModule {}
