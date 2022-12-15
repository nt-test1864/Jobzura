import middleware from '../../../middleware/middleware'
import nextConnect from 'next-connect'
import {GetUserJobs} from '../../../JS/DB-cloudFunctions'
import {ParsePathGiveParameter} from "../../../JS/BackendFunctions";

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
  console.log(req.body)

  const UserWallet = ParsePathGiveParameter(req.url);
  if(UserWallet == -1){res.end()}

  console.log("UserWallet: " + UserWallet);
  const jobs = await GetUserJobs(UserWallet.toLowerCase());

  var packagedJobs = []
  //console.log("jobs.length: " + jobs.length);
  
  for(let i = 0; i < jobs.length; i++){
    packagedJobs.push({id: i+1, name : jobs[i]})
      //console.log("jobs[i]: " + jobs[i]);
  }

  res.end(JSON.stringify(packagedJobs, null, 3));
})

export const config = {
  api: {
    bodyParser: false
  }
} 
export default apiRoute

