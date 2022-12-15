import middleware from '../../../../middleware/middleware'
import nextConnect from 'next-connect'
import admin from "../../../../_firebase-admin"
import {ParsePathGiveParameter} from "../../../../JS/BackendFunctions";

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
  const UserWallet = ParsePathGiveParameter(req.url);
  if(UserWallet == -1){res.end()}

  const userProfile = await GetUserProfile(UserWallet.toLowerCase());
  if(userProfile?.length > 0){ 
    
    var intermedUserProfile = {};

    for (const [key, value] of Object.entries(userProfile)) {
      console.log(key, value);

      if('stringValue' in value){
        intermedUserProfile[key] = value.stringValue;
      } else if('integerValue' in value){
        intermedUserProfile[key] = value.integerValue;
      } else {

        var c = [];
        for(var i = 0; i < value.arrayValue.values.length; i++){

          if('stringValue' in value.arrayValue.values[i]){
            c.push(value.arrayValue.values[i].stringValue);
          } else if('integerValue' in value.arrayValue.values[i]){
            c.push(value.arrayValue.values[i].integerValue);
          }
        }

        intermedUserProfile[key] = c;
      }
    }

    var packagedUserProfile = [];
    packagedUserProfile.push({id: 1, name : intermedUserProfile})

    res.end(JSON.stringify(packagedUserProfile, null, 3));
  } 

  res.end(JSON.stringify([], null, 3));

})

export const config = {
  api: {
    bodyParser: false
  }
} 
export default apiRoute


async function GetUserProfile(userWallet){
  const res = await admin.firestore().collection('users').doc(userWallet).get();
  console.log(res);

  if("_fieldsProto" in res){
    console.log(res['_fieldsProto']);
    return res['_fieldsProto'];
  } else {
    return [];
  }
}