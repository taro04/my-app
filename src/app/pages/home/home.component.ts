import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { cosmosclient, rest } from 'cosmos-client';
import { InlineResponse20027Balances } from 'cosmos-client/cjs/openapi/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  nodeURL = 'http://localhost:1317';
  chainID = "mars";
  sdk: cosmosclient.CosmosSDK;
  //address = "";
  //"alice" with address "cosmos164pmswcyra95d2vfag9elgew9qmvnkwfuj7z0s"
  //"bob" with address "cosmos134y0u7wyxyt467jyx6swacgrg8ynyzjqshdd64"
  //"someone1" : cosmos1nl3856m4mjlgmukntldmgdg7t5yc593dmxfsml"
  //"someone2" : cosmos1fulw7j29ptg7szyn7xdmc2pky6lmy7ytvel3cd"
  //"someone3" : cosmos1qqva4829ujj4vrl9nxk6sc7nv8mn08zrjj3k5e

  address$: BehaviorSubject<string> = new BehaviorSubject("");
  destAddress$: BehaviorSubject<string> = new BehaviorSubject("");

  accAddress$: Observable<cosmosclient.AccAddress | undefined>;
  balances$: Observable<InlineResponse20027Balances[] | undefined>;

  constructor() {
    this.sdk = new cosmosclient.CosmosSDK(this.nodeURL, this.chainID);
    //this.address$ = new BehaviorSubject(this.address);
    //addressからaccAddressを取得
    this.accAddress$ = this.address$.pipe(
      map((address) => {
        try {
          return cosmosclient.AccAddress.fromString(address);
        } catch (error) {
          console.error(error);
          return undefined;
        }
      }),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      })
    )
    //所持tokenを取得
    this.balances$ = this.accAddress$.pipe(
      mergeMap((accAddress) => {
        console.log(accAddress);
        if (accAddress === undefined) {
          console.error('Address is invalid or does not have balances!');
          return of([]);
        }
        return rest.cosmos.bank.allBalances(this.sdk, accAddress).then(res => res.data.balances);
      }),
      catchError((error) => {
        console.error(error);
        return of([]);
      })
    )
  }

  onReceiveEventDestAddress(destAdr_: string) {
    this.destAddress$.next(destAdr_);
  }

  onReceiveEventFromChild(address_: string) {
    this.address$.next(address_);
  }

  ngOnInit(): void {
  }

}
