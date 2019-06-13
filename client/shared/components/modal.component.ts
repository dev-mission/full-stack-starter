import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';

import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-shared-modal',
  templateUrl: './modal.component.html'
})
export class ModalComponent {
  @Input() confirmLabel: string = null;
  @Input() dangerLabel: string = null;
  @Input() dismissLabel: string = null;
  @Output() dismiss = new EventEmitter<any>();
  @Output() confirm = new EventEmitter<any>();
  @Output() danger = new EventEmitter<any>();
  @ViewChild('content') content: TemplateRef<any>;
  modalRef: NgbModalRef;
  data: any = null;

  constructor(private modal: NgbModal) {}

  show(data: any) {
    this.data = data;
    this.open(this.content);
    return false;
  }

  open(content: any) {
    this.modalRef = this.modal.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  onConfirm() {
    this.modalRef.close();
    this.confirm.emit(this.data);
  }

  onDismiss() {
    this.modalRef.dismiss();
    this.dismiss.emit(this.data);
  }

  onDanger() {
    this.modalRef.close();
    this.danger.emit(this.data);
  }
}
