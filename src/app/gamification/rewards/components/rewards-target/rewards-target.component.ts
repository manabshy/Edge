import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core'

@Component({
  selector: 'app-rewards-target',
  template: `
    <div
      class="p-2 flex flex-col border border-gray-300 rounded-md h-44"
      [ngClass]="bgColor"
    >
      <ng-container *ngIf="targetReached; else default">
        <p class="font-bold px-2 text-center text-sm mb-2">
          SMASHED IT - and you rolled a 5
        </p>
        <img class="w-44 mx-auto" src="/assets/dice.jpg" />
      </ng-container>
      <ng-template #default>
        <div class="flex flex-col justify-between flex-1">
          <ng-container [ngSwitch]="action">
            <ng-container *ngSwitchCase="'bookViewings'">
              <p class="text-blue-900 text-center">
                Book <span class="text-green-600">{{ target }}</span>
                new viewings
              </p>
              <div class="my-2">
                <img src="/assets/viewings-icn.jpg" class="w-28 mx-auto" />
              </div>
            </ng-container>
            <ng-container *ngSwitchCase="'conductViewings'">
              <p class="text-blue-900 text-center">
                Conduct <span class="text-green-600">{{ target }}</span>
                viewings
              </p>
              <div class="my-2">
                <img
                  src="/assets/viewings-conducted-icn.jpg"
                  class="w-28 mx-auto"
                />
              </div>
            </ng-container>
            <ng-container *ngSwitchCase="'bookValuation'">
              <p class="text-blue-900 text-center">
                Book <span class="text-green-600">{{ target }}</span>
                valuation
              </p>
              <div class="my-2">
                <img src="/assets/valuations-icn.jpg" class="w-28 mx-auto" />
              </div>
            </ng-container>
          </ng-container>

          <div class="w-full relative bg-green-200 h-5">
            <div class="absolute top-0 left-0 right-0 h-5">
              <p class="text-center text-sm z-10 relative">{{ progress }}</p>
              <div
                class="absolute left-0 top-0 bg-green-500 h-5"
                [ngClass]="progressWidthClass"
              ></div>
            </div>
          </div>
        </div>
      </ng-template>
    </div>
  `,
})
export class RewardsTargetComponent implements OnInit, OnChanges {
  @Input() progress: number = 0
  @Input() target: number = 5
  @Input() action!: string

  targetReached: boolean = false
  progressWidthClass!: string
  bgColor!: string

  constructor() {}

  ngOnInit(): void {
    this.calculateProgress()
  }

  calculateProgress() {
    this.progressWidthClass =
      this.target === 5
        ? this.progress === 5
          ? 'w-full'
          : 'w-' + this.progress + '/5'
        : this.target === 3
        ? this.progress === 3
          ? 'w-full'
          : 'w-' + this.progress + '/3'
        : this.target === 1
        ? this.progress === 1
          ? 'w-full'
          : ''
        : ''

    this.targetReached = this.progress >= this.target

    this.bgColor = this.targetReached ? 'bg-green-100' : 'bg-white'
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['progress'] && !changes['progress'].firstChange) {
      this.progress = changes['progress'].currentValue
      this.calculateProgress()
    }
  }
}
