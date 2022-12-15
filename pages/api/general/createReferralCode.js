import middleware from '../../../middleware/middleware'
import nextConnect from 'next-connect'
import { CreateReferralCode } from '../../../JS/DB-pushFunctions';
import {GetWalletFromAlias} from '../../../JS/DB-cloudFunctions';
import {ValidateAndReturnMessage, AnyEmpty} from "../../../JS/auth/BackendValidation";
const DOMPurify = require('isomorphic-dompurify');

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.post(async (req, res) => {
  console.log(req.body)
  console.log(req.files)
  

  //------------------------------------------------------------------------------------------------
  //                           Authentication of the received data
  //------------------------------------------------------------------------------------------------

  const address = DOMPurify.sanitize(req.body.address[0].toString());

  const UserWallet = ValidateAndReturnMessage(address, req.body.message_UserWallet[0].toString(), req.body.signature_UserWallet[0].toString()).toLowerCase();

  if(AnyEmpty([UserWallet])){
    res.status(420).end("not all signatures are valid");
  }

  // check that the address is associated with the original address (seller)
  const orgWallet = await GetWalletFromAlias(address.toLowerCase());
  console.log(`orgWallet: ${orgWallet}`);

  // if not - terminate
  if(orgWallet != UserWallet){
    res.status(421).end("signatures are not from an Alias associated with this seller");
  }


  //------------------------------------------------------------------------------------------------
  //                                     The main part
  //------------------------------------------------------------------------------------------------

  console.log("UserWallet: " + UserWallet);
  const referralCode = await CreateReferralCode(UserWallet);

  res.status(201).end(`Referral code create: ${referralCode}`);
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute

