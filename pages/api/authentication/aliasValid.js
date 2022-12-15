import middleware from '../../../middleware/middleware'
import nextConnect from 'next-connect'
import { VerifyMessage } from "../../../JS/auth/messageSigning";
import {GetWalletFromAlias} from '../../../JS/DB-cloudFunctions';


const DOMPurify = require('isomorphic-dompurify');

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.post(async (req, res) => {
  console.log(req.body)
  console.log(req.files)

  const message = DOMPurify.sanitize(req.body.message[0].toString());
  const address = DOMPurify.sanitize(req.body.address[0].toString());
  const signature = DOMPurify.sanitize(req.body.signature[0].toString());
  
  console.log(`message: ${message}`);
  console.log(`address: ${address}`);
  console.log(`signature: ${signature}`);
  

  // verify
  const isValid = VerifyMessage(message, address, signature);
  console.log(`isValid: ${isValid}`); 

  // from the alias get the actual address
  const orgWallet = await GetWalletFromAlias(address);
  console.log(`orgWallet: ${orgWallet}`);
  


  // do the actual thing based on the message variable





  if(orgWallet){
    res.status(201).end(`orgWallet: ${orgWallet}`);
  }
  if(!orgWallet){
    res.status(240).end(`The Alias ${address} cannot be found in DB`);
  }
  else {
    res.status(501).end("false");
  }
  
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute





