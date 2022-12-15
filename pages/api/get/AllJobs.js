import middleware from '../../../middleware/middleware'
import nextConnect from 'next-connect'
import {GetAllJobs} from '../../../JS/DB-cloudFunctions'

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
  console.log(req.body)

  const jobs = await GetAllJobs();

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

