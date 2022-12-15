import middleware from '../../../middleware/middleware'
import nextConnect from 'next-connect'
import { GetAllMessages } from '../../../JS/DB-cloudFunctions'

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
  const offers = await GetAllMessages();

  var packagedOffers = []
  
  for(let i = 0; i < offers.length; i++){
    packagedOffers.push({
      id: i+1, 
      message : offers[i],
    })
  }

  res.end(JSON.stringify(packagedOffers, null, 3));
})

export const config = {
  api: {
    bodyParser: false
  }
} 
export default apiRoute

