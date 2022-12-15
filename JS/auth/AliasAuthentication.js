import axios from "axios";
import { SignMessage, SignCustomMessage, SignMessageWithAlias } from "./messageSigning";
import { SetAlias, GetAlias, RemoveAlias } from './aliasWallet';
import { GetConnectedAddress } from "./Wallet";

async function SendMessage(signedMessage, apiPath){

  var formData = new FormData();
  formData.append("message", signedMessage.message);
  formData.append("signature", signedMessage.signature);
  formData.append("address", signedMessage.address);

  axios.post(apiPath, formData)
  .then((res) => {

    console.log(`res.status: ${res.status}`);

    if (res.status == 240){
      // Alias is not in the DB -> remove Alias from local storage
      RemoveAlias(signedMessage.address) // value is dummy for now, but otherwise we will need the Original Address
      console.log("res.status == 240, removing alias from local storage...")
    }
    
    if (res.status == 201 ) console.log("signedMessage message received!");
    this.fetchExtrashift();
    return true;

  })
  .catch((err) => {
    console.log("failure...");
    return false;
  });

  return true;
}

async function SignWithAliasAndSend(message, apiPath){
  const signedMessage = await SignMessageWithAlias(message);
  return await SendMessage(signedMessage, apiPath);
}

// add this for better looking message for the user to sign (need to adjust some API when accepting this request)
async function SignCustom(message){
  const signedMessage = await SignCustomMessage(message);
  console.log(`signedMessage: ${signedMessage}`);    
  console.log(signedMessage);
  return signedMessage;
}

async function SignAndSend(message){
  const signedMessage = await SignMessage(message);
  if(!signedMessage){return false;}
  return await SendMessage(signedMessage, "/api/authentication/saveAliasToDB");
}


export async function CheckAndCreateAlias(){
  const connectedAddr = await GetConnectedAddress();
  console.log(`connectedAddr: ${connectedAddr}`);

  // check if Alias exists in local storage
  const alias = GetAlias(connectedAddr);
  console.log("alias:")
  console.log(alias);

  // if Alias does not exist - create a new Alias
  if(!alias){
    const aliases = SetAlias(connectedAddr);
    console.log("aliases:")
    console.log(aliases);

    // sign with MM and send to BE - on BE save the Alias, OrgWallet combo to the DB
    const success = await SignAndSend(aliases.public);                                                    
    console.log(`success: ${success}`);

    // if no positive reply (or user did not sign) --- remove the alias from local storage
    if(!success){
      RemoveAlias(connectedAddr);
      return false;
    }
  }

  return true;
}

export async function SendThisSecurlyToBackendWithAlias(message, apiPath){

  const res = await CheckAndCreateAlias();
  if(res == false){return false;}

  // Use the Alias key to actually sign the message and send it to BE - do on back end what ever needs to be done
  const result = await SignWithAliasAndSend(message, apiPath)                                                                  
  console.log(`result: ${result}`);
}
