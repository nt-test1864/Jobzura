import middleware from '../../../../middleware/middleware'
import nextConnect from 'next-connect'
import admin from "../../../../_firebase-admin"

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
  console.log(req.body)

  const agreements = await GetAllAgreements();
  console.log(agreements)

  /**/
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



async function GetAllAgreements(){
  const snapshot = await admin.firestore().collection('contracts').get();
  return snapshot.docs.map(doc => doc.data());

  console.log(res['_fieldsProto']);
  return res['_fieldsProto'];
}
