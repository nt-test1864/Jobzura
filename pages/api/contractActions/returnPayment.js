import middleware from '../../../middleware/middleware'
import nextConnect from 'next-connect'
import { UpdateContracts_ReturnPayment, UpdateNotifications, UpdateUserParticipationData } from '../../../JS/DB-pushFunctions';
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

  const SellerWallet = ValidateAndReturnMessage(address, req.body.message_SellerWallet[0].toString(), req.body.signature_SellerWallet[0].toString()).toLowerCase();
  const transactionHash = ValidateAndReturnMessage(address, req.body.message_transactionHash[0].toString(), req.body.signature_transactionHash[0].toString());
  const objectId = ValidateAndReturnMessage(address, req.body.message_objectId[0].toString(), req.body.signature_objectId[0].toString());

  if(AnyEmpty([SellerWallet, transactionHash, objectId])){
    res.status(420).end("not all signatures are valid");
  }

  // check that the address is associated with the original address (seller)
  const orgWallet = await GetWalletFromAlias(address.toLowerCase());
  console.log(`orgWallet: ${orgWallet}`);

  // if not - terminate
  if(orgWallet != SellerWallet){
    res.status(421).end("signatures are not from an Alias associated with this seller");
  }


  //------------------------------------------------------------------------------------------------
  //                                     The main part
  //------------------------------------------------------------------------------------------------


  console.log("SellerWallet: " + SellerWallet);
  console.log("objectId: " + objectId);
  console.log("transactionHash: " + transactionHash);
  
  await UpdateContracts_ReturnPayment(objectId, transactionHash);
  await UpdateUserParticipationData(SellerWallet, "ReturnPaymentAsSeller");
  await UpdateNotifications(BuyerWallet, "Payment returned");

  res.status(201).end("Payment returned");
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute


