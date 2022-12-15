import middleware from '../../../middleware/middleware'
import nextConnect from 'next-connect'
import {GetContract} from '../../../JS/DB-cloudFunctions'
import {ParsePathGiveParameter} from "../../../JS/BackendFunctions";

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
  console.log(req.body)

  const contractID = ParsePathGiveParameter(req.url);
  if(contractID == -1){res.end()}

  console.log("contractID: " + contractID);
  const contracts = await GetContract(contractID);

  
  var packagedContracts = []
  //console.log("contracts.length: " + contracts.length);
  
  for(let i = 0; i < contracts.length; i++){
    packagedContracts.push({id: i+1, name : contracts[i]})
    //console.log("contracts[i]: " + contracts[i]);
  }

  res.end(JSON.stringify(packagedContracts, null, 3));
})

export const config = {
  api: {
    bodyParser: false
  }
} 
export default apiRoute

