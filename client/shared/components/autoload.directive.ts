import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[app-shared-autoload]'
})
export class AutoloadDirective {
  @Input('app-shared-autoload') paginationLink: string;
  @Output() onLoadMore = new EventEmitter<string>();

  constructor(private el: ElementRef) {
    setTimeout(() => this.onWindowScroll(null), 100);
  }

  private offsetTop() {
    let element = this.el.nativeElement;
    if (!element) {
      return Number.MAX_VALUE;
    }
    let offsetTop = element.offsetTop;
    while (element.offsetParent != document.body) {
      element = element.offsetParent;
      if (!element) {
        return Number.MAX_VALUE;
      }
      offsetTop += element.offsetTop;
    }
    return offsetTop;
  }

  @HostListener('window:scroll', ['$event'])
  private onWindowScroll($event: any) {
    if (this.paginationLink) {
      if (window.scrollY >= (this.offsetTop() - 1.25 * window.innerHeight)) {
        this.onLoadMore.emit(this.paginationLink);
      }
    }
  }
}
