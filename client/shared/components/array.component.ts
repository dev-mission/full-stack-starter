import { Component, EventEmitter, Input, Output } from '@angular/core';
import clone from 'lodash/clone';

@Component({
  selector: 'app-shared-array',
  templateUrl: './array.component.html'
})
export class ArrayComponent {
  @Input() id: string;
  @Input() placeholder: string;
  @Input() object: any;
  @Input() propertyName: string;
  @Output() onAdd = new EventEmitter<string>();
  @Output() onRemove = new EventEmitter<string>();

  newElement: string;

  onRemoveInternal(element: string) {
    let items = clone(this.object[this.propertyName] || []);
    items.splice(items.indexOf(element), 1);
    this.object[this.propertyName] = items;
    this.onRemove.emit(element)
    return false;
  }

  onAddInternal() {
    let items = clone(this.object[this.propertyName] || []);
    items.push(this.newElement);
    this.object[this.propertyName] = items;
    this.onAdd.emit(this.newElement)
    this.newElement = null;
  }
}
