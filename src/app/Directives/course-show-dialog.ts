import { Directive } from '@angular/core';

@Directive({
  selector: '[appCourseShowDialog]',
})
export class CourseShowDialog {// implements OnInit, OnChanges {

  //  @Input() color: string = 'red';
  //  @Input() course!: ICourse;
  // constructor(public elm:ElementRef) {

  //   this.elm.nativeElement.style.borderRadius="10px";
  //  }
  // ngOnInit(): void {
  //   console.log('ngOnInit');
  // }

  //  ngOnChanges(): void {
  //      //1
  //      console.log('ngOnChanges');

  //      this.elm.nativeElement.style.color= `${this.color}`;
  //    }

  //  @HostListener('mouseover') mouseOver(){
  //   this.elm.nativeElement.style.boxShadow = "5px 5px 5px 5px blue";
  //  }

  //  @HostListener('mouseout') mouseOut(){
  //   this.elm.nativeElement.style.boxShadow = "0px 0px 0px 0px blue";
  //  }

}
