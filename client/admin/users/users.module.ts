import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedComponentsModule } from '../../shared/components';

import { UsersRoutingModule } from './users-routing.module';
import { ListUsersComponent } from '.';

@NgModule({
  declarations: [
    ListUsersComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    UsersRoutingModule
  ],
  providers: []
})
export class UsersModule {}
