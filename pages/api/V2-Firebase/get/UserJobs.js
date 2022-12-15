import middleware from '../../../../middleware/middleware'
import nextConnect from 'next-connect'
import admin from "../../../../_firebase-admin"
import {ParsePathGiveParameter} from "../../../../JS/BackendFunctions";

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
  const UserWallet = ParsePathGiveParameter(req.url);
  if(UserWallet == -1){res.end()}

  const jobs = await GetUserJobs(UserWallet.toLowerCase());

  var packagedJobs = []
  
  for(let i = 0; i < jobs.length; i++){
    packagedJobs.push({id: i+1, name : jobs[i]})
  }

  res.end(JSON.stringify(packagedJobs, null, 3));
  
})

export const config = {
  api: {
    bodyParser: false
  }
} 
export default apiRoute


async function GetUserJobs(userWallet){
  const res = await admin.firestore().collection('jobs').where("SellerWallet", "==", userWallet).get();
  const list = res.docs.map(doc => doc.data());
  return list;
}