import { Component, OnInit, Input } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-instructions-search',
  template: `
    <div class="border border-grey-300 w-56 p-4">
      <h3 class="font-bold">
        <i class="fas fa-search"></i>
        Search
      </h3>

      <form [formGroup]="instructionFinderForm" autocompleteOff>
        <fieldset class="mb-3">
          <label for="instructionSearch">Name, email, phone or address</label>
          <input
            class="p-2"
            type="search"
            id="instructionSearch"
            data-testid="instructionSearch"
            aria-label="Search criteria"
            (keydown.enter)="getInstructions()"
            [ngbTypeahead]="suggestions"
            [focusFirst]="false"
            (selectItem)="suggestionSelected($event)"
            formControlName="searchTerm"
          />
        </fieldset>
        <div class="flex flex-wrap">
          <fieldset class="mb-3 flex-1">
            <label for="instructionSearch">Status</label>
            <input class="p-2" type="text" />
          </fieldset>
          <fieldset class="mb-3 ml-2 flex-1">
            <label for="instructionSearch">Date From</label>
            <input class="p-2" type="text" />
          </fieldset>
        </div>
        <div class="flex flex-wrap">
          <fieldset class="mb-3 flex-1">
            <label for="instructionSearch">Lister</label>
            <input class="p-2" type="text" />
          </fieldset>
          <fieldset class="mb-3 ml-2 flex-1">
            <label for="instructionSearch">Office</label>
            <input class="p-2" type="text" />
          </fieldset>
        </div>
        <fieldset class="mb-3 w-full">
          <label for="">Department</label>
          <input class="p-2" type="text" />
        </fieldset>
      </form>
    </div>
  `
})
export class InstructionsSearchComponent implements OnInit {
  instructionFinderForm: FormGroup
  @Input() suggestions: any
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.setupForm()
  }

  private setupForm() {
    this.instructionFinderForm = this.fb.group({
      searchTerm: '',
      date: null,
      statusId: [0],
      valuerId: [0],
      officeId: [0]
    })
  }

  getInstructions() {}
  suggestionSelected(e) {}
}
