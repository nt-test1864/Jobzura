import middleware from '../../../../middleware/middleware'
import nextConnect from 'next-connect'
import admin from "../../../../_firebase-admin"


// ---------------------------------------------------------------------------------------
//  to read with admin only, you have to block the rule for reading and use:
//  await admin.firestore().collection('uploads').doc('jobs').collection("0x1591c783efb2bf91b348b6b31f2b04de1442836c").doc("d7f2a1d6b6f01a77972ff3807e90a6cdc97d039118309ec2").get()
// ---------------------------------------------------------------------------------------



const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
  console.log(req.body)
  
  const jobs = await GetAllJob();

  var packagedJobs = []
  console.log("jobs.length: " + jobs.length);
  
  for(let i = 0; i < jobs.length; i++){
    packagedJobs.push({id: i+1, name : jobs[i]})
      console.log("jobs[i]: " + jobs[i]);
  }

  res.end(JSON.stringify(packagedJobs, null, 3));
})

export const config = {
  api: {
    bodyParser: false
  }
} 
export default apiRoute


async function GetAllJob(){
  const res = await admin.firestore().collection('jobs').get();
  const list = res.docs.map(doc => doc.data());

  console.log(list);
  return list;
}