import middleware from '../../../middleware/middleware'
import nextConnect from 'next-connect'
import { UpdateContracts_ContractAcceptedBySeller, UpdateUserParticipationData, UpdateNotifications  } from '../../../JS/DB-pushFunctions';
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

  const BuyerWallet = ValidateAndReturnMessage(address, req.body.message_BuyerWallet[0].toString(), req.body.signature_BuyerWallet[0].toString());
  const SellerWallet = ValidateAndReturnMessage(address, req.body.message_SellerWallet[0].toString(), req.body.signature_SellerWallet[0].toString());
  const objectId = ValidateAndReturnMessage(address, req.body.message_objectId[0].toString(), req.body.signature_objectId[0].toString());
  const transactionHash = ValidateAndReturnMessage(address, req.body.message_transactionHash[0].toString(), req.body.signature_transactionHash[0].toString());

  // if((BuyerWallet.length == 0 || SellerWallet.length == 0 || objectId.length == 0 || transactionHash.length == 0)){
  if(AnyEmpty([BuyerWallet, SellerWallet, objectId, transactionHash])){
    res.status(420).end("not all signatures are valid");
  }

  // check that the address is associated with the original address (seller)
  const orgWallet = await GetWalletFromAlias(address.toLowerCase());
  console.log(`orgWallet: ${orgWallet}`);

  // if not - terminate
  if(orgWallet != BuyerWallet){
    res.status(421).end("signatures are not from an Alias associated with this seller");
  }


  //------------------------------------------------------------------------------------------------
  //                                     The main part
  //------------------------------------------------------------------------------------------------

  console.log("BuyerWallet: " + BuyerWallet);
  console.log("SellerWallet: " + SellerWallet);
  console.log("objectId: " + objectId);
  console.log("transactionHash: " + transactionHash);

  await UpdateContracts_ContractAcceptedBySeller(SellerWallet, objectId, transactionHash);

  await UpdateUserParticipationData(SellerWallet, "PersonalizedContractsAcceptedAsSeller");
  await UpdateUserParticipationData(BuyerWallet, "PersonalizedContractsInvolvedAsBuyer");
  await UpdateUserParticipationData(SellerWallet, "PersonalizedContractsInvolvedAsSeller"); 
  await UpdateNotifications(SellerWallet, `New accepted offer by buyer`);
  await UpdateNotifications(BuyerWallet, `Accepted offer`);

  res.status(201).end("Offer created");
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute

