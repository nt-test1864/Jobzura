import middleware from '../../../middleware/middleware'
import nextConnect from 'next-connect'
import { VerifyMessage } from "../../../JS/auth/messageSigning";
import {SaveAliasToMoralisDB} from '../../../JS/DB-pushFunctions';


const DOMPurify = require('isomorphic-dompurify');

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.post(async (req, res) => {
  console.log(req.body)
  console.log(req.files)

  /*
    const wallet = DOMPurify.sanitize(req.body.wallet[0].toString());
    const alias = DOMPurify.sanitize(req.body.alias[0].toString());
    console.log(`wallet: ${wallet}`);
    console.log(`alias: ${alias}`);
    
    const signedMessage = DOMPurify.sanitize(req.body.signedMessage[0].toString());
    console.log(signedMessage);
    const str = `from: ${aliases.wallet} \nalias: ${aliases.alias}`;
  */

  const message = DOMPurify.sanitize(req.body.message[0].toString());
  const address = DOMPurify.sanitize(req.body.address[0].toString());
  const signature = DOMPurify.sanitize(req.body.signature[0].toString());
  
  console.log(`message: ${message}`);
  console.log(`address: ${address}`);
  console.log(`signature: ${signature}`);
  

  // verify
  const isValid = VerifyMessage(message, address, signature);
  console.log(`isValid: ${isValid}`); 

  
  
  if(isValid){
    // message = alias
    // store (alias, address) into DB
    await SaveAliasToMoralisDB(address.toLowerCase(), message.toLowerCase());

    // const doesItBelongToAddress = await DoesAliasBelongToWallet(address, message);
    // console.log(`doesItBelongToAddress: ${doesItBelongToAddress}`);

    res.status(201).end("Signature verified");
  }
  else {
    res.status(501).end("Signature not accepted");
  }
  
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute





