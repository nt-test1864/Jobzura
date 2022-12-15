import middleware from '../../../../middleware/middleware'
import nextConnect from 'next-connect'
import {ParsePathGiveMessageSender, ParsePathGiveMessageReceiver} from "../../../../JS/BackendFunctions";
import admin from "../../../../_firebase-admin"

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
  console.log(req.body)

  const user = ParsePathGiveParameter(req.url);
  if(user == -1){res.end()}
  console.log("user: " + user);        
  
  // TODO: validate the address length + signature of the API call

  const messages = await GetMessagesUsersList(user.toLowerCase());

  
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





async function GetMessagesUsersList(user){


  const contract = await admin.firestore().collection('messages').where(user, "in", ["sender", "receiver"]).get();
  console.log(contract);
  console.log(contract['_fieldsProto']);
  return contract['_fieldsProto'];

  // this will give a bunch of messages, we still need to get the other user addresses out... 

}