import middleware from '../../../../middleware/middleware'
import nextConnect from 'next-connect'
import {ParsePathGiveParameter, ParsePathFirstParam, ParsePathSecondParam} from "../../../../JS/BackendFunctions";
import admin from "../../../../_firebase-admin"



// ---------------------------------------------------------------------------------------
//  to read with admin only, you have to block the rule for reading and use:
//  await admin.firestore().collection('uploads').doc('jobs').collection("0x1591c783efb2bf91b348b6b31f2b04de1442836c").doc("d7f2a1d6b6f01a77972ff3807e90a6cdc97d039118309ec2").get()
// ---------------------------------------------------------------------------------------



const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
  console.log(req.body)

  /*
  const seller = ParsePathFirstParam(req.url);
  if(seller == -1){res.end()}

  const epoch = ParsePathSecondParam(req.url);
  if(epoch == -1){res.end()}
  
  const job = await GetJob(seller, epoch);
  */

  const epoch = ParsePathGiveParameter(req.url);
  if(epoch == -1){res.end()}
   
  console.log("epoch: " + epoch);                     // new should be:    seller=""&epoch=""
  
  
  const job = await GetJob(epoch);

  var packagedJobs = []
  packagedJobs.push({id: 1, name : job})

  res.end(JSON.stringify(packagedJobs, null, 3));
})

export const config = {
  api: {
    bodyParser: false
  }
} 
export default apiRoute



async function GetJob(epoch){
  const res = await admin.firestore().collection('jobs').doc(epoch).get();
  console.log(res);
  console.log(res['_fieldsProto']);
  return res['_fieldsProto'];
}