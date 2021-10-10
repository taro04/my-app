import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { InlineResponse20027Balances } from 'cosmos-client/cjs/openapi/api';

@Component({
  selector: 'view-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class ViewHomeComponent implements OnInit {

  @Input() address_: string; //もらう
  @Input() balances$_?: Observable<InlineResponse20027Balances[] | undefined>;; //もらう

  @Output() inputAddressEvent: EventEmitter<string> = new EventEmitter<string>()

  constructor() {
    this.address_ = ""
    //if (this.address_ === undefined){this.address_}
  }

  ngOnInit(): void {
  }

  //onSelectedTxTypeChanged(inputAddress: string): void {
  //  this.inputAddressEvent.emit(inputAddress)
  //}

  onClick(inputAddress: string): void {
    this.inputAddressEvent.emit(inputAddress);
  }

}
