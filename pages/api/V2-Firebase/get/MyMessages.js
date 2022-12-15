import middleware from '../../../../middleware/middleware'
import nextConnect from 'next-connect'
import {ParsePathGiveMessageSender, ParsePathGiveMessageReceiver} from "../../../../JS/BackendFunctions";
import admin from "../../../../_firebase-admin"

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


  // TODO: validate the addressws length + signature of the API call


  const messages = await GetUserMessagesPair(messageSender.toLowerCase(), messageReceiver.toLowerCase());

  
  //var packagedContracts = []
  //console.log("contracts.length: " + contracts.length);
  
  //for(let i = 0; i < contracts.length; i++){
  //  packagedContracts.push({id: i+1, name : contracts[i]})
    //console.log("contracts[i]: " + contracts[i]);
  //}

  res.end(JSON.stringify(messages, null, 3));
})

export const config = {
  api: {
    bodyParser: false
  }
} 
export default apiRoute





async function GetUserMessagesPair(sender, receiver){

  var concatedAddress;

  if(sender.localeCompare(receiver) == -1){
    concatedAddress = sender + receiver;
  } else {
    concatedAddress = receiver + sender;
  }

  console.log("concatedAddress: " + concatedAddress);


  const contract = await admin.firestore().collection('messages').doc(concatedAddress).get();
  console.log(contract);
  console.log(contract['_fieldsProto']);
  return contract['_fieldsProto'];

}