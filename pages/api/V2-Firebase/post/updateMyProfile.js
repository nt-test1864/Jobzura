import middleware from "../../../../middleware/middleware.js";
import nextConnect from "next-connect";
const DOMPurify = require("isomorphic-dompurify");
//var Moralis = require("moralis/node");
const fs = require("fs");
const AWS = require("aws-sdk");
var crypto = require("crypto");
/*
import {
  UpdateUserProfileLanguageToMoralisDB,
  UpdateUserProfileHeadlineToMoralisDB,
  UpdateUserProfileDescriptionToMoralisDB,
  UpdateUserProfileTimezoneToMoralisDB,
  UpdateUserProfileSkillsToMoralisDB,
} from "../../../JS/DB-pushFunctions.js";
*/
import {GetWalletFromAlias} from '../../../../JS/DB-cloudFunctions';
import {ValidateAndReturnMessage, AnyEmpty} from "../../../../JS/auth/BackendValidation";
import admin from "../../../../_firebase-admin";

const DO_SPACES_ID = "PMPSVLSBZWCFNIRNYBYM";
const DO_SPACES_SECRET = "MRWAGMp+cj3b9ObGuq2EvHH235LjEEY+8+v6dlrjALc";
const DO_SPACES_URL = "https://fra1.digitaloceanspaces.com";
const DO_SPACES_BUCKET = "easylaunchnftdospace1";
const PUBLIC_URL = "https://easylaunchnftdospace1.fra1.digitaloceanspaces.com";

const s3Client = new AWS.S3({
  endpoint: DO_SPACES_URL,
  region: "fra1",
  credentials: {
    accessKeyId: DO_SPACES_ID,
    secretAccessKey: DO_SPACES_SECRET,
  },
});

const apiRoute = nextConnect();
apiRoute.use(middleware);

apiRoute.post(async (req, res) => {

  console.log(req.body)


  //------------------------------------------------------------------------------------------------
  //                           Authentication of the received data
  //------------------------------------------------------------------------------------------------

  const address = DOMPurify.sanitize(req.body.address[0].toString());

  const UserWallet = ValidateAndReturnMessage(address, req.body.message_UserWallet[0].toString(), req.body.signature_UserWallet[0].toString()).toLowerCase();
  const Operation = ValidateAndReturnMessage(address, req.body.message_O[0].toString(), req.body.signature_O[0].toString());
  //const objectId = ValidateAndReturnMessage(address, req.body.message_objectId[0].toString(), req.body.signature_objectId[0].toString());

  // check that the address is associated with the original address (seller)
  const orgWallet = await GetWalletFromAlias(address.toLowerCase());
  console.log(`orgWallet: ${orgWallet}`);

  // if not - terminate
  if(orgWallet != UserWallet){
    res.status(421).end("signatures are not from an Alias associated with this seller");
  }


  //------------------------------------------------------------------------------------------------
  //                                     The main part
  //------------------------------------------------------------------------------------------------


  switch (Operation) {
    case "Timezone":
      // authentication 
      const Timezone = ValidateAndReturnMessage(address, req.body.message_Timezone[0].toString(), req.body.signature_Timezone[0].toString());
      if(AnyEmpty([UserWallet, Operation, Timezone])){
        res.status(420).end("not all signatures are valid");
      }

      await UpdateUserProfileTimezoneToMoralisDB(UserWallet, Timezone);
      res.status(201).end("Timezone updated");
      break;

    case "Languages":
      // authentication 
      const Languages = ValidateAndReturnMessage(address, req.body.message_Languages[0].toString(), req.body.signature_Languages[0].toString());
      if(AnyEmpty([UserWallet, Operation, Languages])){
        res.status(420).end("not all signatures are valid");
      }

      await UpdateUserProfileLanguageToMoralisDB(UserWallet, Languages);
      res.status(201).end("Language updated");
      break;

    case "Headline":
      // authentication 
      const Headline = ValidateAndReturnMessage(address, req.body.message_Headline[0].toString(), req.body.signature_Headline[0].toString());
      if(AnyEmpty([UserWallet, Operation, Headline])){
        res.status(420).end("not all signatures are valid");
      }

      await UpdateUserProfileHeadlineToMoralisDB(UserWallet, Headline);
      res.status(201).end("Headline updated");
      break;

    case "Description":
      // authentication 
      const Description = ValidateAndReturnMessage(address, req.body.message_Description[0].toString(), req.body.signature_Description[0].toString());
      if(AnyEmpty([UserWallet, Operation, Description])){
        res.status(420).end("not all signatures are valid");
      }

      await UpdateUserProfileDescriptionToMoralisDB(UserWallet, Description);
      res.status(201).end("Description updated");
      break;

    case "Skills":
      // authentication 
      const Skills = ValidateAndReturnMessage(address, req.body.message_Skills[0].toString(), req.body.signature_Skills[0].toString());
      if(AnyEmpty([UserWallet, Operation, Skills])){
        res.status(420).end("not all signatures are valid");
      }

      await UpdateUserProfileSkillsToMoralisDB(UserWallet, Skills);
      res.status(201).end("Skills updated");
      break;

    default:
    // code block
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiRoute;






async function UpdateUserProfileTimezoneToMoralisDB(UserWallet, Timezone){

  const userProfile = {
    UserWallet: UserWallet,
    Timezone: Timezone,
  }
  
  await admin.firestore().collection('users').doc(UserWallet).set(userProfile, { merge: true });
}

async function UpdateUserProfileLanguageToMoralisDB(UserWallet, Languages){
  const userProfile = {
    UserWallet: UserWallet,
    Languages: Languages,
  }
  
  await admin.firestore().collection('users').doc(UserWallet).set(userProfile, { merge: true });
}

async function UpdateUserProfileHeadlineToMoralisDB(UserWallet, Headline){
  const userProfile = {
    UserWallet: UserWallet,
    Headline: Headline,
  }
  
  await admin.firestore().collection('users').doc(UserWallet).set(userProfile, { merge: true });
}

async function UpdateUserProfileDescriptionToMoralisDB(UserWallet, Description){
  const userProfile = {
    UserWallet: UserWallet,
    Description: Description,
  }
  
  await admin.firestore().collection('users').doc(UserWallet).set(userProfile, { merge: true });
}

async function UpdateUserProfileSkillsToMoralisDB(UserWallet, Skills){
  const userProfile = {
    UserWallet: UserWallet,
    Skills: Skills,
  }
  
  await admin.firestore().collection('users').doc(UserWallet).set(userProfile, { merge: true });
}
