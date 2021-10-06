import { Component } from '@angular/core';
import { cosmosclient, rest, proto } from 'cosmos-client';
import { BehaviorSubject, of, Observable,timer, throwError } from 'rxjs';
import { map, mergeMap,catchError,switchMap } from 'rxjs/operators';

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
  address$: Observable<cosmosclient.AccAddress | undefined>;
  //account$: Observable<proto.cosmos.auth.v1beta1.BaseAccount | unknown | undefined>;
  balances$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;

  constructor() {

    //sdk
    this.sdk = new cosmosclient.CosmosSDK(this.nodeURL, this.chainID)
    //addressのObservable
    this.address$ = this.addr$.pipe(
      map((addr) => {
        //cosmosclient.config.setBech32Prefix(addr)
        console.log("add$_input!!")
        try{
          return cosmosclient.AccAddress.fromString(addr)
        } catch (error) {
          console.log("add$_try_catch_no_Error");
          console.error(error)
          return undefined
        }
      }),
/*
      catchError((error) => {
        console.log("add$_catchError_no_err");
        console.error(error);
        return of(undefined);
      }),
*/
    );

    //関数でbalancesのObservable取得
    this.balances$ = this.address$.pipe(
      mergeMap((address) => {
        if (address === undefined){
          console.log("balance if de err desuyo");
          throw new Error("balance if throw de err desuyo");
        }
        return rest.cosmos.bank
          .allBalances(this.sdk, address)
          .then((res) => res.data.balances || [])
      }),
/*
      catchError((error) => {
        console.log("balance catchErr de desuyo");
        console.error(error);
        return of(undefined);
      }),
*/
    );
  }

  //更新
  changeAddress(str:string):void{
    console.log("input!")
    this.addr$.next(str)
  }


  //挙動確認
  test_catchError(){
    //emit immediately, then every 1s
    const source = timer(0, 1000);
    //switch to new inner observable when source emits, emit items that are emitted
    const example = source.pipe(
      switchMap(() => {
        return throwError("Error desuyo")
/*
        .pipe(
            catchError(val => of(`I caught on after throwError: ${val}`))
          )
*/
        //return of('test');
      }),
      catchError(val => of(`I caught on pipe a: ${val}`))
    );
    const subscribe = example.subscribe(
      (val) => {console.log('on sucess error ' + val);console.log(subscribe);},
      (c) => console.log('on error ' + c),
    );
  }

  /*/check_sum
  bech32_polymod(values:number):number{
    const GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3]
    var chk = 1
    //for v in values:{
    for (let i = 0; i < values; i++)
      b = (chk >> 25)
      chk = (chk & 0x1ffffff) << 5 ^ v
      for i in range(5){
        chk ^= GEN[i] if ((b >> i) & 1) else 0
      }
    }
    return chk
  }

  bech32_hrp_expand(s:number):number{
    return [ord(x) >> 5 for x in s] + [0] + [ord(x) & 31 for x in s]
  }

  bech32_verify_checksum(hrp, data):boolean{
    return this.bech32_polymod(this.bech32_hrp_expand(hrp) + data) == 1
  }
  */
}
