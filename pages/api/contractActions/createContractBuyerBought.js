import middleware from '../../../middleware/middleware'
import nextConnect from 'next-connect'
import { UpdateContracts_ContractCreatedByBuyer, UpdateUserParticipationData } from '../../../JS/DB-pushFunctions';
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

  const BuyerWallet = ValidateAndReturnMessage(address, req.body.message_BuyerWallet[0].toString(), req.body.signature_BuyerWallet[0].toString()).toLowerCase();
  const SellerWallet = ValidateAndReturnMessage(address, req.body.message_SellerWallet[0].toString(), req.body.signature_SellerWallet[0].toString()).toLowerCase();
  const index = ValidateAndReturnMessage(address, req.body.message_index[0].toString(), req.body.signature_index[0].toString());
  const JobID = ValidateAndReturnMessage(address, req.body.message_JobID[0].toString(), req.body.signature_JobID[0].toString());
  const Title = ValidateAndReturnMessage(address, req.body.message_Title[0].toString(), req.body.signature_Title[0].toString());
  const Description = ValidateAndReturnMessage(address, req.body.message_Description[0].toString(), req.body.signature_Description[0].toString());
  const hashDescription = ValidateAndReturnMessage(address, req.body.message_hashDescription[0].toString(), req.body.signature_hashDescription[0].toString());
  const Price = ValidateAndReturnMessage(address, req.body.message_Price[0].toString(), req.body.signature_Price[0].toString());
  const CurrencyTicker = ValidateAndReturnMessage(address, req.body.message_CurrencyTicker[0].toString(), req.body.signature_CurrencyTicker[0].toString());
  const ChainID = ValidateAndReturnMessage(address, req.body.message_ChainID[0].toString(), req.body.signature_ChainID[0].toString());
  const transactionHash = ValidateAndReturnMessage(address, req.body.message_transactionHash[0].toString(), req.body.signature_transactionHash[0].toString());
  const OfferValidUntil = ValidateAndReturnMessage(address, req.body.message_OfferValidUntil[0].toString(), req.body.signature_OfferValidUntil[0].toString());
  const TimeToDeliver = ValidateAndReturnMessage(address, req.body.message_TimeToDeliver[0].toString(), req.body.signature_TimeToDeliver[0].toString());
  const Arbiters = ValidateAndReturnMessage(address, req.body.message_Arbiters[0].toString(), req.body.signature_Arbiters[0].toString());

  if(AnyEmpty([BuyerWallet, SellerWallet, index, JobID, Title, Description, hashDescription, Price, CurrencyTicker, ChainID, transactionHash, OfferValidUntil, TimeToDeliver, Arbiters])){
    res.status(420).end("not all signatures are valid");
  }

  // check that the address is associated with the original address (seller)
  const orgWallet = await GetWalletFromAlias(address.toLowerCase());
  console.log(`orgWallet: ${orgWallet}`);
  console.log(`BuyerWallet: ${BuyerWallet}`);

  // if not - terminate
  if(orgWallet != BuyerWallet){
    res.status(421).end("signatures are not from an Alias associated with this buyer");
  }


  //------------------------------------------------------------------------------------------------
  //                                     The main part
  //------------------------------------------------------------------------------------------------

  //const PersonalizedOffer = DOMPurify.sanitize(req.body.PersonalizedOffer[0].toString());
  console.log("BuyerWallet: " + BuyerWallet);
  console.log("SellerWallet: " + SellerWallet); 
  console.log("index: " + index);
  console.log("JobID: " + JobID);
  console.log("Title: " + Title);
  console.log("Description: " + Description);
  console.log("hashDescription: " + hashDescription);
  console.log("Price: " + Price);
  console.log("CurrencyTicker: " + CurrencyTicker);
  console.log("ChainID: " + ChainID); 
  console.log("transactionHash: " + transactionHash);
  console.log("OfferValidUntil: " + OfferValidUntil);
  console.log("TimeToDeliver: " + TimeToDeliver);
  //console.log("PersonalizedOffer: " + PersonalizedOffer);
  console.log("Arbiters: " + Arbiters);

  await UpdateContracts_ContractCreatedByBuyer(BuyerWallet, SellerWallet, index, JobID, Title, Description, hashDescription, Price, CurrencyTicker, ChainID, transactionHash, OfferValidUntil, TimeToDeliver, Arbiters)

  console.log("temp step out")


  // if artbiters are not empty, split it by commma and increment for each
  if(Arbiters){
    console.log("Arbiters is not empty");
    const arbiterArray = Arbiters.split(",");

    for(let i = 0; i < arbiterArray.length; i++) {
      console.log("arbiterArray[i]: " + arbiterArray[i]);
      await UpdateUserParticipationData(arbiterArray[i], "ReceivedArbiterRole");
    }
  }

  // same for PersonalizedOffer/SellerWallet
  await UpdateUserParticipationData(SellerWallet, "ReceivedPersonalizedOffer");

  res.status(201).end("Offer created");
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute



