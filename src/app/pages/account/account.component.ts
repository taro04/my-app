import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { BehaviorSubject, of, Observable,from } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { cosmosclient, rest, proto } from 'cosmos-client';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  @Output() destAddressEvent: EventEmitter<string> = new EventEmitter<string>()


  privKey? :proto.cosmos.crypto.secp256k1.PrivKey
  pubKey? :cosmosclient.PubKey
  fromAddress? :cosmosclient.AccAddress

  sdk = new cosmosclient.CosmosSDK('http://localhost:1317', 'mars');
  destAddress_:string = ""

  constructor() {
    //Todo:Observableで書き換え
    from( cosmosclient.generatePrivKeyFromMnemonic('attend puzzle tourist surface until dial tackle patch rookie acquire alpha turn liberty early fossil label vivid talent attitude help chicken asset elegant pilot'),)
    .subscribe((_key)=>{
      this.privKey = new proto.cosmos.crypto.secp256k1.PrivKey({key: _key})
      this.pubKey = this.privKey.pubKey();
      this.fromAddress = cosmosclient.AccAddress.fromPublicKey(this.pubKey);
    })
  }

  ngOnInit(): void {
  }

  async tx(toAddress:cosmosclient.AccAddress):Promise<void>{

    // get account info
    const account = await rest.cosmos.auth
      .account(this.sdk, this.fromAddress!)
      .then((res) => res.data.account && cosmosclient.codec.unpackCosmosAny(res.data.account))
      .catch((_) => undefined);
      if (!(account instanceof proto.cosmos.auth.v1beta1.BaseAccount)) {
        console.log("if accout",account);
        return;
      }

  // build tx
  const msgSend = new proto.cosmos.bank.v1beta1.MsgSend({
    from_address: this.fromAddress!.toString(),
    to_address: toAddress.toString(),
    amount: [{ denom: 'token', amount: '1' }],
  });

  const txBody = new proto.cosmos.tx.v1beta1.TxBody({
    messages: [cosmosclient.codec.packAny(msgSend)],
  });
  const authInfo = new proto.cosmos.tx.v1beta1.AuthInfo({
    signer_infos: [
      {
        public_key: cosmosclient.codec.packAny(this.pubKey),
        mode_info: {
          single: {
            mode: proto.cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_DIRECT,
          },
        },
        sequence: account.sequence,
      },
    ],
    fee: {
      gas_limit: cosmosclient.Long.fromString('200000'),
    },
  });

  // sign
  const txBuilder = new cosmosclient.TxBuilder(this.sdk, txBody, authInfo);
  const signDocBytes = txBuilder.signDocBytes(account.account_number)
  txBuilder.addSignature(this.privKey!.sign(signDocBytes));

  // broadcast
  const res = await rest.cosmos.tx.broadcastTx(this.sdk, {
    tx_bytes: txBuilder.txBytes(),
    mode: rest.cosmos.tx.BroadcastTxMode.Block,
    });
    console.log(res);
  }

  onDestAdrClick(adr: string): void {
    this.destAddressEvent.emit(adr);

    //const adr_ = "cosmos134y0u7wyxyt467jyx6swacgrg8ynyzjqshdd64"
    const address_:cosmosclient.AccAddress = cosmosclient.AccAddress.fromString(adr);
    this.tx(address_).then()
  }

}
