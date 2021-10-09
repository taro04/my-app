import { Component, OnInit, Input  } from '@angular/core';

@Component({
  selector: 'view-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class ViewHomeComponent implements OnInit {

  @Input() address?: string; //もらう

  constructor() { }

  ngOnInit(): void {
  }

}
