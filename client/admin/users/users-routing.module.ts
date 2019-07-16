import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditUserComponent, ListUsersComponent } from '.';

const appRoutes: Routes = [
  {
    path: 'users',
    component: ListUsersComponent,
    children: [
      {
        path: ':id',
        component: EditUserComponent
      }
    ]
  }
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
