import middleware from '../../../middleware/middleware'
import nextConnect from 'next-connect'
import {GetAllReviews} from '../../../JS/DB-cloudFunctions'

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
  console.log(req.body)

  const reviews = await GetAllReviews();

  var packagedJobs = []
  
  for(let i = 0; i < reviews.length; i++){
    packagedJobs.push({id: i+1, name : reviews[i]})
  }

  res.end(JSON.stringify(packagedJobs, null, 3));
})

export const config = {
  api: {
    bodyParser: false
  }
} 
export default apiRoute

