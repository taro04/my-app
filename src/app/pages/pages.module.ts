import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account/account.component';


@NgModule({
  declarations: [
    AccountComponent
  ],
  imports: [
    CommonModule
  ],
  //exports: [AppComponent],
})
export class PagesModule { }
//不使用。いつか使えるようにしたい。Viewsとpagesで同じhomeComponentを設定できるよう。
