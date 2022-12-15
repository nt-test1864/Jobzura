//import {Form, message} from 'antd';
import axios from "axios";
import { TestFunction_MM } from "../JS/local_web3_Moralis";
import { SignMessage, SignCustomMessage, SignMessageWithAlias, VerifyMessage } from "../JS/auth/messageSigning";
import { SetAlias, GetAlias, RemoveAlias } from '../JS/auth/aliasWallet';
import { GetConnectedAddress } from "../JS/auth/Wallet";

import {SendThisSecurlyToBackendWithAlias} from "../JS/auth/AliasAuthentication";


export default function Test() {

  // dummy function
  async function RunTest(){
    const response = await TestFunction_MM("GetPrice");
    console.log(response);
  }

  // obsolete
  async function SignWithAlias_StandAlone(message){

    const connectedAddr = await GetConnectedAddress();
    console.log(`connectedAddr: ${connectedAddr}`);

    // check if Alias exists                
    const alias = GetAlias(connectedAddr);
    console.log(`alias: ${alias}`);

    // if not, create new Alias                 -------------------------------------------------------------------------------------------  need to sign it and send it to the backend for propper application, but great otherwise
    if(!alias){
      const aliases = SetAlias(connectedAddr);
      console.log("aliases:")
      console.log(aliases);
    }


    const signedMessage = await SignMessageWithAlias(message);

    console.log(`signedMessage:`);
    console.log(signedMessage);

    return signedMessage;
  }

  // probably not needed here
  async function Verify(){
    const isValid = VerifyMessage(m, a, s);
    console.log(`isValid: ${isValid}`); 
  }

  // obsolete
  async function CreateAliasAndSend(){

    const connectedAddr = await GetConnectedAddress();
    console.log(`connectedAddr: ${connectedAddr}`);
    const aliases = SetAlias(connectedAddr);

    console.log("--------------------------------")
    console.log(aliases);

    // const message = `from: ${aliases.wallet} \nalias: ${aliases.alias}`;  {/* shows up quite well */}
    const message = aliases.private;  // show just the alias in the MM
    const signedMessage = await Sign(message);  

    return SendMessage(signedMessage, "/api/authentication/saveAliasToDB");
    /*
    // send to back end
    var formData = new FormData();
  
    formData.append("message", signedMessage.message);
    formData.append("signature", signedMessage.signature);
    formData.append("address", signedMessage.address);

    //axios.post("/api/authentication/aliasValid", formData)
    axios.post("/api/authentication/saveAliasToDB", formData)
    .then((res) => {
      if (res.status == 201 ) console.log("signedMessage message received!");
      this.fetchExtrashift();
    })
    .catch((err) => {
      console.log("failure...");
    });    
    */
  }

  // obsolete
  async function Sign(message){
    const signedMessage = await SignMessage(message);
    console.log(`signedMessage: ${signedMessage}`);  
    console.log(signedMessage);  
    return signedMessage;
  }

  // unneccessary
  async function CheckIfAliasAddressPairIsValid(connectedAddr){
    // send to back end
    var formData = new FormData();

    const signedMessage = await SignWithAlias(connectedAddr);  // yes sign with alias, so we don't prompt the user

    formData.append("message", signedMessage.message);
    formData.append("signature", signedMessage.signature);
    formData.append("address", signedMessage.address);

    //axios.post("/api/authentication/aliasValid", formData)
    axios.post("/api/authentication/saveAliasToDB.js", formData)
    .then((res) => {
      if (res.status == 201 ) console.log("signedMessage message received!");
      this.fetchExtrashift();
    })
    .catch((err) => {
      console.log("failure...");
    });    
  }



  return (
    <> 
      {/* 
        <button onClick={RunTest}>Run Test</button>

        <button onClick={() => Sign('something to sign')}>Sign Message</button>

        <button onClick={() => SignCustom('something to sign')}>Sign Custom Message</button>
          
        <button onClick={Verify}>Verify Message</button>

        <br></br>
        <br></br>

        <button onClick={() => SignAndSend('something to sign')}>Sign and Send</button>

        <button onClick={CreateAliasAndSend}>Run Alias</button>

        <br></br>
        <br></br>
        <button onClick={() => SignWithAlias('something to sign')}>SignWithAlias</button>

        <br></br>
        <br></br>        
      */}


      <br></br>
      <br></br>
      <button onClick={() => SendThisSecurlyToBackendWithAlias('something to sign', "/api/authentication/aliasValid")}>SendThisSecurlyToBackendWithAlias</button>

    </>
  )
}
