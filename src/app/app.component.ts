import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { cosmosclient, rest } from 'cosmos-client';
import { InlineResponse20027Balances } from 'cosmos-client/cjs/openapi/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  //定義
  nodeURL = 'http://localhost:1317'
  chainID = "mars"
  sdk: cosmosclient.CosmosSDK;
  address = "cosmos1nl3856m4mjlgmukntldmgdg7t5yc593dmxfsml" // default_address_(Alice)
  address$ = new BehaviorSubject(this.address);
  accAddress$: Observable<cosmosclient.AccAddress | undefined>;
  //account$: Observable<proto.cosmos.auth.v1beta1.BaseAccount | unknown | undefined>;
  balances$: Observable<InlineResponse20027Balances[] | undefined>;

  constructor() {
    //sdk
    this.sdk = new cosmosclient.CosmosSDK(this.nodeURL, this.chainID)
    //accAddressのObservableを取得、エラーの場合コンソールに出力し、undefinedを返す。
    this.accAddress$ = this.address$.pipe(
      map((address) => {
        console.log("add$_input!!")
        try {
          console.log("try ok!!")
          return cosmosclient.AccAddress.fromString(address)
        } catch (error) {
          console.log("add$_try_catch_no_Error");
          console.error(error)
          return undefined
        }
      }),
      catchError((error) => {
        console.log("accAdress input")
        console.error(error)
        return of(undefined)
      })
    );
    //関数でbalancesのObservable取得
    this.balances$ = this.accAddress$.pipe(
      mergeMap((accAdr) => {
        console.log(accAdr)
        if (accAdr === undefined){
          throw Error('Address is invalid or does not have balances!')
        }
        return rest.cosmos.bank
          .allBalances(this.sdk, accAdr)
          .then(res => res.data.balances)
      }),
      catchError((error) => {
        console.error(error)
        return of([])
      })
    );
  }

  ngOnInit(): void {}

  //更新
  changeAddress(str:string):void{
    console.log("input pb")
    this.address$.next(str)
  }
}
