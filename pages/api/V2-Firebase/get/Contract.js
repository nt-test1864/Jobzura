import middleware from '../../../../middleware/middleware'
import nextConnect from 'next-connect'
import {ParsePathGiveParameter} from "../../../../JS/BackendFunctions";
import admin from "../../../../_firebase-admin"

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
  console.log(req.body)

  const contractID = ParsePathGiveParameter(req.url);
  if(contractID == -1){res.end()}

  console.log("contractID: " + contractID);
  const contract = await GetContract(contractID);

  
  //var packagedContracts = []
  //console.log("contracts.length: " + contracts.length);
  
  //for(let i = 0; i < contracts.length; i++){
  //  packagedContracts.push({id: i+1, name : contracts[i]})
    //console.log("contracts[i]: " + contracts[i]);
  //}

  res.end(JSON.stringify(contract, null, 3));
})

export const config = {
  api: {
    bodyParser: false
  }
} 
export default apiRoute



async function GetContract(contractID){
  const contract = await admin.firestore().collection('contracts').doc(contractID).get();
  console.log(contract['_fieldsProto']);
  return contract['_fieldsProto'];
}