import middleware from '../../../middleware/middleware'
import nextConnect from 'next-connect'
import {GetUserDisputeMessagesPair} from '../../../JS/DB-cloudFunctions'
import {ParsePathGiveMessageSender, ParsePathGiveMessageReceiver} from "../../../JS/BackendFunctions";

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
  console.log(req.body)

  const messageSender = ParsePathGiveMessageSender(req.url);
  if(messageSender == -1){res.end()}

  console.log("messageSender: " + messageSender);

  const messageReceiver = ParsePathGiveMessageReceiver(req.url);
  if(messageReceiver == -1){res.end()}

  
  console.log("messageReceiver: " + messageReceiver);
  const offers = await GetUserDisputeMessagesPair(messageSender.toLowerCase(), messageReceiver.toLowerCase());

  
  var packagedOffers = []
  console.log("offers.length: " + offers.length);
  
  for(let i = 0; i < offers.length; i++){
    packagedOffers.push({id: i+1, name : offers[i]})
    console.log("offers[i]: " + offers[i]);
  }
  
  res.end(JSON.stringify(packagedOffers, null, 3));
})

export const config = {
  api: {
    bodyParser: false
  }
} 
export default apiRoute
