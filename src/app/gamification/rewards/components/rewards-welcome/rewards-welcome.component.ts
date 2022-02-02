import { Component, Output, EventEmitter, OnInit } from '@angular/core'

@Component({
  selector: 'app-rewards-welcome',
  styles: [`
  .bg-ocean-green-200 {
    background-color: '#9CD1BE' !important;
    --tw-shadow-color: '#9CD1BE' !important;

  }
    `],
  template: `
    <div class="w-full h-full flex flex-col mx-auto my-10 lg:mx-18">
      <p class="text-2xl font-bold text-center">Welcome to your rewards board</p>
      <p class="text-lg text-center">Select the icon that speaks to you - each icon represents a D&G Value.</p>

      <div class="w-full items-justified flex flex-col md:flex-row my-10 md:my-16">
        <div *ngFor="let icon of icons" class="w-full sm:w-1/2 md:w-1/4 rounded-md p-4 text-center mx-auto">
          <div
            class="rounded-full p-6 w-24 h-24 mx-auto cursor-pointer hover:shadow-md active:shadow-none active:scale-95 animate__animated hover:bg-ocean-green-200 active:bg-ocean-green-300 transition-all duration-100 hover:ease-in"
            [ngClass]="
              icon.selected
                ? 'bg-' + icon.colorClass + '-200 ' + icon.animateClass
                : ''
            "
            (click)="changeIcon(icon)"
          >
            <img src="assets/gamification-icons/{{ icon.icnName }}.svg" class="mt-1 h-10 w-10 border-0 mx-auto" />
          </div>
          <p class="text-lg font-bold mt-4">{{ icon.name }}</p>
          <p class="text-center mt-1 px-6">
            {{ icon.description }}
          </p>
        </div>
      </div>
      <div class="mx-auto w-auto transition-all duration-300" *ngIf="showSaveButton">
        <app-button
          [backgroundColorClass]="'ocean-green'"
          [label]="'Save & Continue'"
          (onClick)="saveAndContinue()"
        ></app-button>
      </div>
    </div>
  `
})
export class RewardsWelcomeComponent implements OnInit {
  @Output() onSave: EventEmitter<any> = new EventEmitter()

  icons: any[]
  showSaveButton: boolean = false
  constructor() {}

  ngOnInit(): void {
    this.icons = [
      {
        name: 'Passionate',
        description:
          'Everyone should have someone to turn to; someone they can trust. This is the foundation of our business. We are always there for you.',
        icnName: 'passionate',
        colorClass: 'ocean-green',
        animateClass: 'animate__rubberBand',
        dynamicStyle: '',
        selected: false
      },
      {
        name: 'Climber',
        description:
          " It's our aim to surprise and delight. We deliver to your needs and always look to provide solutions beyond your expectations.",
        icnName: 'climber',
        colorClass: 'ocean-green',
        animateClass: 'animate__rubberBand',
        dynamicStyle: '',
        selected: false
      },
      {
        name: 'Expert',
        description:
          'We are not the cheapest. We are the best of breed. Our track record, market knowledge and relentless work ethic cannot be equalled.',
        icnName: 'expert',
        colorClass: 'ocean-green',
        animateClass: 'animate__rubberBand',
        dynamicStyle: '',
        selected: false
      },
      {
        name: 'Trailblazer',
        description:
          'Our passion and energy for innovation knows no bounds. From technology to customer experiences, better never stops.',
        icnName: 'trailblazer',
        colorClass: 'ocean-green',
        animateClass: 'animate__rubberBand',
        dynamicStyle: '',
        selected: false
      }
    ]
  }

  changeIcon(icon) {
    this.showSaveButton = true
    icon.selected = !icon.selected

    this.icons.forEach((i) => {
      if (i.name !== icon.name) {
        i.selected = false
        // i.dynamicStyle = ''
      } else if (i.name === icon.name) {
        i.selected = true
        // i.dynamicStyle = 'bg-' + icon.colorClass + '-300'
      }
    })
  }

  saveAndContinue() {
    const selectedIcon = this.icons.find((i) => i.selected)

    if (selectedIcon) {
      this.onSave.emit(selectedIcon.icnName)
    }
  }
}
