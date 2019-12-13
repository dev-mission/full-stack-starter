import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shared-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  @Input() color = '#000';
}
