import { Component, OnInit } from '@angular/core';
import { cosmosclient, rest, proto } from 'cosmos-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private http: HttpClient,
  ) {
    this.sdk = new cosmosclient.CosmosSDK(this.nodeURL,this.chainID)
    this.address_from_nemonic().then()
  }

  sdk: cosmosclient.CosmosSDK
  nodeURL = 'http://localhost:1317'
  chainID = "mars"
  nemonic = 'sword heart bridge bulk wonder furnace cube window purity rich convince panda bag solution vocal voice group depth donate margin call match swap defy'
  address = "cosmos1z9gwnnwxdp6qfvg3hekmlqtvju0npm2u6yttw7" //Aliceのaddress

  //デフォルトアドレス枠
  privKey! :proto.cosmos.crypto.secp256k1.PrivKey
  pubKey! :cosmosclient.PubKey
  fromAddress! :cosmosclient.AccAddress
  account! :proto.cosmos.auth.v1beta1.BaseAccount
  denoms:any

  //send
  amount = 0
  denom = "stake"
  toAd = "cosmos1rjh23wvj3uqy7p9acuapcr356rc9dmvfs38yf5"


  //デフォルトアドレスをニーモニックから取得(constractor)
  address_from_nemonic = async (): Promise<void> => {
    this.privKey = new proto.cosmos.crypto.secp256k1.PrivKey({
      key: await cosmosclient.generatePrivKeyFromMnemonic(this.nemonic),
    });
    this.pubKey = this.privKey.pubKey();
    this.fromAddress = cosmosclient.AccAddress.fromPublicKey(this.pubKey);
  }


  // get account info
  get_account_info = async (Adr:string): Promise<void> =>{
    const address = cosmosclient.AccAddress.fromString(Adr)
    const _account = await rest.cosmos.auth
    .account(this.sdk, address)
    .then((res) => res.data.account && cosmosclient.codec.unpackCosmosAny(res.data.account))
    .catch((_) => undefined);
    if (!(_account instanceof proto.cosmos.auth.v1beta1.BaseAccount)) {
      console.log("can't get account",_account);
      return;
    }else{
      console.log("get account");
      console.dir(_account);
    }
    this.account = _account
    this.getBalance(_account.address.toString())
  }

  getBalance(address :string):void{
    const url = `${this.nodeURL}/cosmos/bank/v1beta1/balances/${address}`
    this.http.get<string>(url)
    .subscribe( jsonfile => {
          console.dir(jsonfile)
          this.address = address
          this.denoms = JSON.parse(JSON.stringify(jsonfile))["balances"] //ngForで表示する配列。
        });
      }
}
