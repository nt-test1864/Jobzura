import middleware from '../../../middleware/middleware.js'
import nextConnect from 'next-connect'
const DOMPurify = require('isomorphic-dompurify');
import {UpdateReviewLikedDisliked} from "../../../JS/DB-pushFunctions.js"
import {ValidateAndReturnMessage, AnyEmpty} from "../../../JS/auth/BackendValidation";


const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.post(async (req, res) => {
  console.log(req.body)

  const address = DOMPurify.sanitize(req.body.toString());

  const userWallet = req.body.UserWallet[0].toString().toLowerCase(); //ValidateAndReturnMessage(address, req.body.UserWallet[0].toString(), req.body.UserWallet[0].toString()).toLowerCase();
  const objectId = req.body.review[0].toString(); //ValidateAndReturnMessage(address, req.body.review[0].toString(), req.body.review[0].toString());
  const status = req.body.status[0].toString(); //ValidateAndReturnMessage(address, req.body.status[0].toString(), req.body.status[0].toString());

  const responseMsg = await UpdateReviewLikedDisliked(userWallet,objectId,status)

  res.status(201).json({ message: 'Like Status Updated' })
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute


