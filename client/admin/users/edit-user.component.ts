import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NavigationService } from '../../shared/services';

@Component({
  templateUrl: './edit-user.component.html'
})
export class EditUserComponent {
  id: string = null;
  icon: any = null;

  constructor(private navigation: NavigationService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
  }

  onIconRemove(record: any) {
    record.iconUrl = null;
    this.icon = null;
  }

  onIconUploaded(record: any, upload: any) {
    record.iconUrl = upload.href;
    this.icon = upload;
  }

  onDelete() {
    this.navigation.backTo(`/users`);
  }
}
