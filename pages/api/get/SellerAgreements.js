import middleware from '../../../middleware/middleware'
import nextConnect from 'next-connect'
import {GetSellerAgreements} from '../../../JS/DB-cloudFunctions'
import {ParsePathGiveParameter} from "../../../JS/BackendFunctions";

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
  const UserWallet = ParsePathGiveParameter(req.url);
  if(UserWallet == -1){res.end()}

  const agreements = await GetSellerAgreements(UserWallet.toLowerCase());

  var packagedAgreements = []
  
  for(let i = 0; i < agreements.length; i++){
    packagedAgreements.push({id: i+1, name : agreements[i]})
  }

  res.end(JSON.stringify(packagedAgreements, null, 3));
  
})

export const config = {
  api: {
    bodyParser: false
  }
} 
export default apiRoute
