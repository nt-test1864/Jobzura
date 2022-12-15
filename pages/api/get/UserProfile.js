import middleware from '../../../middleware/middleware'
import nextConnect from 'next-connect'
import {GetUsersDetails} from '../../../JS/DB-cloudFunctions'
import {ParsePathGiveParameter} from "../../../JS/BackendFunctions";
import { GetUserProfile } from '../../../JS/DB-cloudFunctions';

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {   
  // console.log(req.body)

  // await UpdateUserParticipationData(SellerWallet, "PersonalizedContractsAcceptedAsSeller");

  const UserWallet = ParsePathGiveParameter(req.url).toLowerCase();
  // const UserWallet = '0x2c5f037879ed7e0ac328531987b04a15620e8bfe';
  if(UserWallet == -1){res.end()}

  console.log("UserWallet: " + UserWallet);

  const offers = await GetUserProfile(UserWallet);
  var packagedOffers = []

  for(let i = 0; i < offers.length; i++){
    packagedOffers.push({id: i+1, name : offers[i]})
  }

  res.end(JSON.stringify(packagedOffers, null, 3));
})

export const config = {
  api: {
    bodyParser: false
  }
} 
export default apiRoute

