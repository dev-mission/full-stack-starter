import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AssetPipe, ErrorPipe, PhonePipe } from '.';

@NgModule({
  declarations: [
    AssetPipe,
    ErrorPipe,
    PhonePipe,
  ],
  exports: [
    AssetPipe,
    ErrorPipe,
    PhonePipe,
  ],
  imports: [
    CommonModule,
  ],
  providers: []
})
export class SharedPipesModule {}
