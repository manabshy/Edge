import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-menu',
  template: `
    <button class="w-10 h-10 bg-white rounded-full" (click)="menu.toggle($event)">
      <ng-template [ngIf]="icn" [ngIfElse]="noIcn">
        <i class="fa fa-chevron-down"></i>
      </ng-template>
      <ng-template #noIcn>
        <svg aria-hidden="true" width="64" height="64" viewBox="0 0 64 64" class="icon">
          <ellipse class="st0" cx="32" cy="10.5" rx="5.9" ry="6" />
          <ellipse class="st0" cx="32" cy="32" rx="5.9" ry="6" />
          <ellipse class="st0" cx="32" cy="53.5" rx="5.9" ry="6" />
        </svg>
      </ng-template>
    </button>
    <p-menu [appendTo]="'body'" #menu [popup]="true" [model]="menuItems"></p-menu>
  `
})
export class MenuComponent {
  @Input() menuItems: any[]
  @Input() icn?: string
}
