import middleware from '../../../middleware/middleware.js'
import nextConnect from 'next-connect'
const DOMPurify = require('isomorphic-dompurify');
import {SaveRatingToMoralisDB} from "../../../JS/DB-pushFunctions.js"
import {AppendRatingToJob, GetReview} from "../../../JS/DB-cloudFunctions.js"
import {GetWalletFromAlias} from '../../../JS/DB-cloudFunctions';
import {ValidateAndReturnMessage, AnyEmpty} from "../../../JS/auth/BackendValidation";


const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.post(async (req, res) => {
  console.log(req.body)

  //------------------------------------------------------------------------------------------------
  //                           Authentication of the received data
  //------------------------------------------------------------------------------------------------

  const address = DOMPurify.sanitize(req.body.address[0].toString());

  const UserWallet = ValidateAndReturnMessage(address, req.body.message_UserWallet[0].toString(), req.body.signature_UserWallet[0].toString()).toLowerCase();
  const rating = ValidateAndReturnMessage(address, req.body.message_rating[0].toString(), req.body.signature_rating[0].toString());
  const review = ValidateAndReturnMessage(address, req.body.message_review[0].toString(), req.body.signature_review[0].toString());
  const privateReview = ValidateAndReturnMessage(address, req.body.message_privateReview[0].toString(), req.body.signature_privateReview[0].toString());
  const jobID = ValidateAndReturnMessage(address, req.body.message_jobID[0].toString(), req.body.signature_jobID[0].toString());
  const jobSeller = ValidateAndReturnMessage(address, req.body.message_jobSeller[0].toString(), req.body.signature_jobSeller[0].toString());
  const jobBuyer = ValidateAndReturnMessage(address, req.body.message_jobBuyer[0].toString(), req.body.signature_jobBuyer[0].toString());
  const like = ValidateAndReturnMessage(address, req.body.message_like[0].toString(), req.body.signature_like[0].toString());
  const dislike = ValidateAndReturnMessage(address, req.body.message_dislike[0].toString(), req.body.signature_dislike[0].toString());

  // like and dislike can be empty - so don't include them below

  if(AnyEmpty([UserWallet, rating, review, privateReview, jobID, jobSeller, jobBuyer])){
    res.status(420).end("not all signatures are valid");
    return;
  }

  // check that the address is associated with the original address (seller)
  const orgWallet = await GetWalletFromAlias(address.toLowerCase());
  console.log(`orgWallet: ${orgWallet}`);

  // if not - terminate
  if(orgWallet != UserWallet){
    res.status(421).end("signatures are not from an Alias associated with this seller");
    return;
  }


  //------------------------------------------------------------------------------------------------
  //                                     The main part
  //------------------------------------------------------------------------------------------------


  console.log(`UserWallet: ${UserWallet}`)
  console.log(`rating: ${rating}`)
  console.log(`review: ${review}`)
  console.log(`privateReview: ${privateReview}`)
  console.log(`jobID: ${jobID}`)
  console.log(`jobSeller: ${jobSeller}`)
  console.log(`jobBuyer: ${jobBuyer}`)
  console.log(`like: ${like}`)
  console.log(`dislike: ${dislike}`)

  // TODO: add a check if this user is even eligible to give a reivew!!! -------------------------------------------------------------

  await SaveRatingToMoralisDB(
    rating,
    review,
    privateReview,
    jobID,
    jobSeller,
    jobBuyer,
  )

  await AppendRatingToJob(jobID, rating)

  res.status(201).json({ message: 'Rating Created' })
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute


