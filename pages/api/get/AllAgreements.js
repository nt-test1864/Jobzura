import middleware from '../../../middleware/middleware'
import nextConnect from 'next-connect'
import { GetAllAgreements } from '../../../JS/DB-cloudFunctions'

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
  console.log(req.body)

  const agreements = await GetAllAgreements();

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

