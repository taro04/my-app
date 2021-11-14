import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Link3Component } from './link3/link3.component';

@NgModule({
  declarations: [
    Link3Component
  ],
  imports: [
    CommonModule,
  ]
  //exports: [AppComponent],
})
export class PagesModule { }
//不使用。いつか使えるようにしたい。Viewsとpagesで同じhomeComponentを設定できるよう。
