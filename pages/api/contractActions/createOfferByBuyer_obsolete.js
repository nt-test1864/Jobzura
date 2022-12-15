import middleware from '../../../middleware/middleware'
import nextConnect from 'next-connect'
import { UpdateContracts_ContractCreatedByBuyer, UpdateUserParticipationData } from '../../../JS/DB-pushFunctions';

const DOMPurify = require('isomorphic-dompurify');

const apiRoute = nextConnect()
apiRoute.use(middleware)

apiRoute.post(async (req, res) => {
    console.log(req.body)
    console.log(req.files)

    const BuyerWallet = DOMPurify.sanitize(req.body.BuyerWallet[0].toString());
    const Title = DOMPurify.sanitize(req.body.Title[0].toString());
    const Description = DOMPurify.sanitize(req.body.Description[0].toString());
    const hashDescription = DOMPurify.sanitize(req.body.hashDescription[0].toString());
    const Price = DOMPurify.sanitize(req.body.Price[0].toString());
    const TimeToDeliver = DOMPurify.sanitize(req.body.TimeToDeliver[0].toString());
    const transactionHash = DOMPurify.sanitize(req.body.transactionHash[0].toString());
    const index = DOMPurify.sanitize(req.body.index[0].toString());
    const OfferValidUntil = DOMPurify.sanitize(req.body.OfferValidUntil[0].toString());
    const PersonalizedOffer = DOMPurify.sanitize(req.body.PersonalizedOffer[0].toString());
    const Arbiters = DOMPurify.sanitize(req.body.Arbiters[0].toString());
    const CurrencyTicker = DOMPurify.sanitize(req.body.CurrencyTicker[0].toString());
    const ChainID = DOMPurify.sanitize(req.body.ChainID[0].toString());

    console.log("BuyerWallet: " + BuyerWallet);
    console.log("Title: " + Title);
    console.log("Description: " + Description);
    console.log("hashDescription: " + hashDescription);
    console.log("Price: " + Price);
    console.log("CurrencyTicker: " + CurrencyTicker);
    console.log("ChainID: " + ChainID);    
    console.log("TimeToDeliver: " + TimeToDeliver);
    console.log("transactionHash: " + transactionHash);
    console.log("index: " + index);
    console.log("OfferValidUntil: " + OfferValidUntil);
    console.log("PersonalizedOffer: " + PersonalizedOffer);
    console.log("Arbiters: " + Arbiters);

    // SellerWallet
    // JobID

    // BuyerWallet, SellerWallet, index, JobID, Title, Description, hashDescription, Price, CurrencyTicker, ChainID, transactionHash, OfferValidUntil, TimeToDeliver, Arbiters
    await UpdateContracts_ContractCreatedByBuyer(BuyerWallet, "sellerwallet", index, 12345, Title, Description, hashDescription, Price, CurrencyTicker, ChainID, transactionHash, OfferValidUntil, TimeToDeliver, Arbiters)

    // if artbiters are not empty, split it by commma and increment for each
    if(Arbiters){
        console.log("Arbiters is not empty");
        const arbiterArray = Arbiters.split(",");

        for(let i = 0; i < arbiterArray.length; i++) {
            console.log("arbiterArray[i]: " + arbiterArray[i]);
            await UpdateUserParticipationData(arbiterArray[i], "ReceivedArbiterRole");
        }
    }

    // same for PersonalizedOffer
    if(PersonalizedOffer){
        console.log("PersonalizedOffer is not empty");
        const PersonalizedOfferArray = PersonalizedOffer.split(",");

        for(let i = 0; i < PersonalizedOfferArray.length; i++) {
            console.log("PersonalizedOfferArray[i] = " + PersonalizedOfferArray[i]);
            await UpdateUserParticipationData(PersonalizedOfferArray[i], "ReceivedPersonalizedOffer");
        }
    }


    console.log("Intermediate part");

    // if PersonalizedOffer  is empty...
    if(IsPersonalized(!PersonalizedOffer)){
        console.log("not personalized, general contract created");
        await UpdateUserParticipationData(BuyerWallet, "ContractsCreatedAsBuyer");
    } else {
        console.log("personalized contract created");
        await UpdateUserParticipationData(BuyerWallet, "PersonalizedContractsCreatedAsBuyer");
    }

    res.status(201).end("Offer created");
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default apiRoute

function IsPersonalized(PersonalizedOffer){
    return (!PersonalizedOffer) ? false : true;
}




