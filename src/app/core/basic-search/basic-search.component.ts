import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/ngx-bootstrap-typeahead';
import { Instruction } from 'src/app/dashboard/shared/dashboard';

@Component({
  selector: 'app-basic-search',
  templateUrl: './basic-search.component.html',
  styleUrls: ['./basic-search.component.scss']
})
export class BasicSearchComponent implements OnInit {
  @Input() searchResults: [];
  @Input() selectedInstruction:Instruction;
  selectedOption: string;
  searchCtrl = new FormControl();
  searchForm: FormGroup;
  constructor() { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: this.searchCtrl
    });

  }
  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = event.item;
  }
}
