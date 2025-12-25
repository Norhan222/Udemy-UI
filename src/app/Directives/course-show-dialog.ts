import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appCourseShowDialog]',
  standalone: true
})
export class CourseShowDialog {
  @Input() dialog!: { visible: boolean; data: any };
  @Input() hoverData!: any; // Object اللي هنبعته

  private timeoutId: any;

  @HostListener('mouseenter')
  onEnter() {
    clearTimeout(this.timeoutId);
    this.dialog.data = this.hoverData;
    this.dialog.visible = true;
  }

  @HostListener('mouseleave')
  onLeave() {
    this.timeoutId = setTimeout(() => {
      this.dialog.visible = false;
    }, 200);
  }

}

/*
import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHoverPrimeDialog]',
  standalone: true
})
export class HoverPrimeDialogDirective {

  @Input() dialog!: { visible: boolean };

  @HostListener('mouseenter')
  open() {
    if (this.dialog) {
      this.dialog.visible = true;
    }
  }

  @HostListener('mouseleave')
  close() {
    if (this.dialog) {
      this.dialog.visible = false;
    }
  }
}

*/ 