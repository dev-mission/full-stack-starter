import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shared-error',
  templateUrl: './error.component.html'
})
export class ErrorComponent {
  @Input() error: any = null;
}
