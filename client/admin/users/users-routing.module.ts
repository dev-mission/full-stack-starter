import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListUsersComponent } from '.';

const appRoutes: Routes = [
  { path: 'users', component: ListUsersComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class UsersRoutingModule {}
