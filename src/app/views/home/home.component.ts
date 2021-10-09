import { Component, OnInit, Input  } from '@angular/core';
import { Observable } from 'rxjs';
import { InlineResponse20027Balances } from 'cosmos-client/cjs/openapi/api';

@Component({
  selector: 'view-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class ViewHomeComponent implements OnInit {

  @Input() address_?: string; //もらう
  @Input() balances$_?: Observable<InlineResponse20027Balances[] | undefined>;; //もらう

  constructor() { }

  ngOnInit(): void {
  }

}
