import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  // Toggle open class (open /close) dropdown
  @HostListener('click') onToggleOpenClass() {
    if (this.elementRef.nativeElement.classList.contains('open')) {
      this.renderer.removeClass(this.elementRef.nativeElement, 'open');
    } else {
      this.renderer.addClass(this.elementRef.nativeElement, 'open');
    }
  }

}
