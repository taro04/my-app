import { Component } from '@angular/core';
import { cosmosclient, rest, proto } from 'cosmos-client';
import { BehaviorSubject, of, Observable } from 'rxjs';
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
  //alice:cosmos1z9gwnnwxdp6qfvg3hekmlqtvju0npm2u6yttw7
  //bob  :cosmos1rjh23wvj3uqy7p9acuapcr356rc9dmvfs38yf5

  //cosmos-sdk.service
  sdk: cosmosclient.CosmosSDK;
  //restURL$ = new BehaviorSubject(this.nodeURL);
  //chainID$ = new BehaviorSubject(this.chainID);

  //
  addr$ = new BehaviorSubject(this.address);
  address$: Observable<cosmosclient.AccAddress>;
  account$: Observable<proto.cosmos.auth.v1beta1.BaseAccount | unknown | undefined>;
  balances$: Observable<proto.cosmos.base.v1beta1.ICoin[]>;

  constructor() {

    //sdk
    this.sdk = new cosmosclient.CosmosSDK(this.nodeURL, this.chainID)
    //this.sdk$ = combineLatest([this.restURL$, this.chainID$]).pipe(
    //  map(([restURL, chainID]) => ( new cosmosclient.CosmosSDK(restURL, chainID)))
    //);
    //addressのObservable
    this.address$ = this.addr$.pipe(
      map((addr) => cosmosclient.AccAddress.fromString(addr)),
    );
    //sdk+address
    //const combined$ = combineLatest([this.sdk$, this.address$]);

    //res->でaddressのObservable
    this.account$ = this.address$.pipe(
      mergeMap((address) =>
        rest.cosmos.auth
          .account(this.sdk, address)
          .then((res) => res.data.account && cosmosclient.codec.unpackCosmosAny(res.data.account))
          .catch((_) => {
            console.error(_);
            return of(undefined);
          }),
      ),
    );
    //関数でbalancesのObservable
    this.balances$ = this.address$.pipe(
      mergeMap((address) =>
        rest.cosmos.bank.allBalances(this.sdk, address).then((res) => res.data.balances || []),
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
