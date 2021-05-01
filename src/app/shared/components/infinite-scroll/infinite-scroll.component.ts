import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.scss']
})
export class InfiniteScrollComponent implements OnInit, OnDestroy {
  @Input() options = {};
  @Output() scrolled = new EventEmitter();
  @ViewChild('anchor', { static: true }) anchor: ElementRef<HTMLElement>;

  private observer: IntersectionObserver;


  constructor(private host: ElementRef) { }

  ngOnInit(): void {
    const options = { root: null, ...this.options };
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { this.scrolled.emit(); }
    }, options);
    console.log(this.anchor, 'anchor')
    this.observer.observe(this.anchor?.nativeElement);
  }

  get Element() { return this.host?.nativeElement; }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}
