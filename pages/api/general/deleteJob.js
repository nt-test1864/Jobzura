import middleware from '../../../middleware/middleware'
import nextConnect from 'next-connect'
import {DeleteJob} from '../../../JS/DB-cloudFunctions'
import {ParsePathGiveParameter} from "../../../JS/BackendFunctions";

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
  const JobID = ParsePathGiveParameter(req.url, "JobID");
  const response = await DeleteJob(JobID);
  res.json(response);
})

export const config = {
  api: {
    bodyParser: false
  }
} 
export default apiRoute

