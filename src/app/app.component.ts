import { Component } from '@angular/core';
import { cosmosclient, rest, proto } from 'cosmos-client';
import { BehaviorSubject, combineLatest, observable, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  //定義
  nodeURL = 'http://localhost:1317'
  chainID = "mars"
  address = "cosmos1z9gwnnwxdp6qfvg3hekmlqtvju0npm2u6yttw7" // default_address_(Alice)

  //cosmos-sdk.service
  sdk$: Observable<cosmosclient.CosmosSDK>;
  restURL$ = new BehaviorSubject(this.nodeURL);
  chainID$ = new BehaviorSubject(this.chainID);

  //
  addr$ = new BehaviorSubject(this.address);
  address$: Observable<cosmosclient.AccAddress>;
  account$: Observable<proto.cosmos.auth.v1beta1.BaseAccount | unknown | undefined>;
  balances$: Observable<proto.cosmos.base.v1beta1.ICoin[]>;

  constructor() {

    //sdkのObservable
    this.sdk$ = combineLatest([this.restURL$, this.chainID$]).pipe(
      map(([restURL, chainID]) => ( new cosmosclient.CosmosSDK(restURL, chainID)))
    );
    //addressのObservable
    this.address$ = this.addr$.pipe(
      map((addr) => cosmosclient.AccAddress.fromString(addr)),
    );
    //sdk+address
    const combined$ = combineLatest([this.sdk$, this.address$]);
    //res->でaddressのObservable
    this.account$ = combined$.pipe(
      mergeMap(([sdk, address]) =>
        rest.cosmos.auth
          .account(sdk, address)
          .then((res) => res.data.account && cosmosclient.codec.unpackCosmosAny(res.data.account))
          .catch((_) => {
            console.log("kokode err")
            console.error(_);
            return undefined;
          }),
      ),
    );
    //関数でbalancesのObservable
    this.balances$ = combined$.pipe(
      mergeMap(([sdk, address]) =>
        rest.cosmos.bank.allBalances(sdk, address).then((res) => res.data.balances || []),
      ),
    );
  }

  //更新
  changeAddress(str:string):void{
    this.addr$.next(str)
  }
}

/*
getBalance(address :string):void{
  const url = `${this.nodeURL}/cosmos/bank/v1beta1/balances/${address}`
  this.http.get<string>(url)
  .subscribe( jsonfile => {
        console.dir(jsonfile)
        this.address = address
        this.denoms = JSON.parse(JSON.stringify(jsonfile))["balances"] //ngForで表示する配列。
      });
    }
*/
