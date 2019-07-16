import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedComponentsModule } from '../../shared/components';
import { SharedPipesModule } from '../../shared/pipes';

import { UsersRoutingModule } from './users-routing.module';
import { EditUserComponent, ListUsersComponent } from '.';

@NgModule({
  declarations: [
    EditUserComponent,
    ListUsersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedComponentsModule,
    SharedPipesModule,
    UsersRoutingModule
  ],
  providers: []
})
export class UsersModule {}
