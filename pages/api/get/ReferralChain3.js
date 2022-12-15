import middleware from '../../../middleware/middleware'
import nextConnect from 'next-connect'
import {GetReferralChain3} from '../../../JS/DB-cloudFunctions'
import {ParsePathGiveParameter} from "../../../JS/BackendFunctions";

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
  console.log(req.body)

  const UserWallet = ParsePathGiveParameter(req.url).toLowerCase();
  if(UserWallet == -1){res.end()}
  console.log("UserWallet: " + UserWallet);

  const offers = await GetReferralChain3(UserWallet);

  res.end(JSON.stringify(offers, null, 3));
})

export const config = {
  api: {
    bodyParser: false
  }
} 
export default apiRoute

