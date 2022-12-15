import middleware from '../../../middleware/middleware'
import nextConnect from 'next-connect'
import { UseReferralCode } from '../../../JS/DB-pushFunctions';
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

  const UserAddress = ValidateAndReturnMessage(address, req.body.message_UserAddress[0].toString(), req.body.signature_UserAddress[0].toString()).toLowerCase();
  const ReferralCodeUsed = ValidateAndReturnMessage(address, req.body.message_ReferralCodeUsed[0].toString(), req.body.signature_ReferralCodeUsed[0].toString());

  if(AnyEmpty([UserAddress, ReferralCodeUsed])){
    res.status(420).end("not all signatures are valid");
  }

  // check that the address is associated with the original address (seller)
  const orgWallet = await GetWalletFromAlias(address.toLowerCase());
  console.log(`orgWallet: ${orgWallet}`);

  // if not - terminate
  if(orgWallet != UserAddress){
    res.status(421).end("signatures are not from an Alias associated with this seller");
  }


  //------------------------------------------------------------------------------------------------
  //                                     The main part
  //------------------------------------------------------------------------------------------------


  console.log("UserAddress: " + UserAddress);
  console.log("ReferralCodeUsed: " + ReferralCodeUsed);

  const reply = await UseReferralCode(UserAddress, ReferralCodeUsed);


  res.status(201).end(reply);
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute

