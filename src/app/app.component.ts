import { Component } from '@angular/core';
import { cosmosclient, rest, proto } from 'cosmos-client';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { map, mergeMap,catchError } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  //定義
  nodeURL = 'http://localhost:1317'
  chainID = "mars"
  address = "cosmos1nl3856m4mjlgmukntldmgdg7t5yc593dmxfsml" // default_address_(Alice)

  //cosmos-sdk.service
  sdk: cosmosclient.CosmosSDK;
  addr$ = new BehaviorSubject(this.address);
  address$: Observable<cosmosclient.AccAddress>;
  account$: Observable<proto.cosmos.auth.v1beta1.BaseAccount | unknown | undefined>;
  balances$: Observable<proto.cosmos.base.v1beta1.ICoin[]>;

  constructor() {

    //sdk
    this.sdk = new cosmosclient.CosmosSDK(this.nodeURL, this.chainID)
    //addressのObservable
    this.address$ = this.addr$.pipe(
      map((addr) => {
        console.log("input!!")
        return cosmosclient.AccAddress.fromString(addr)}),
      /*
      catchError((error) => {
        console.log("catch_no_err");
        console.error(error);
        return;
      }),
      */
    );
    //res->でaddressのObservable取得
    this.account$ = this.address$.pipe(
      mergeMap((address) =>
        rest.cosmos.auth
          .account(this.sdk, address)
          .then((res) => res.data.account && cosmosclient.codec.unpackCosmosAny(res.data.account))
          .catch((_) => {
            console.log("account_err");
            console.error(_);
            return undefined;
          }),
        ),
      catchError((error) => {
        console.log("catch_no_err");
        console.error(error);
        return of(undefined);
      }),
    );
    //関数でbalancesのObservable取得
    this.balances$ = this.address$.pipe(
      mergeMap((address) =>
        rest.cosmos.bank
          .allBalances(this.sdk, address)
          .then((res) => res.data.balances || [])
      ),
    );
  }

  //更新
  changeAddress(str:string):void{
    console.log("input!")
    this.addr$.next(str)
  }
}
