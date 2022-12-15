import middleware from '../../../../middleware/middleware'
import nextConnect from 'next-connect'
import admin from "../../../../_firebase-admin"

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
  console.log(req.body)

  const disputedContracts = await GetDisputedContracts();
  
  //var packagedContracts = []
  //console.log("contracts.length: " + contracts.length);
  
  //for(let i = 0; i < contracts.length; i++){
  //  packagedContracts.push({id: i+1, name : contracts[i]})
    //console.log("contracts[i]: " + contracts[i]);
  //}

  res.end(JSON.stringify(disputedContracts, null, 3));
})

export const config = {
  api: {
    bodyParser: false
  }
} 
export default apiRoute



async function GetDisputedContracts(){
  const res = await admin.firestore().collection('contracts').where("State", "==", "in dispute").get();
  const list = res.docs.map(doc => doc.data());
  return list;
}