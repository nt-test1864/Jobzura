import middleware from '../../../middleware/middleware.js'
import nextConnect from 'next-connect'
const DOMPurify = require('isomorphic-dompurify');
var Moralis = require("moralis/node");
const fs = require("fs");
const AWS = require('aws-sdk');
var crypto = require("crypto");
import {SaveUserParticipationLanguageToMoralisDB} from "../../../JS/DB-pushFunctions.js"



const DO_SPACES_ID="PMPSVLSBZWCFNIRNYBYM"
const DO_SPACES_SECRET="MRWAGMp+cj3b9ObGuq2EvHH235LjEEY+8+v6dlrjALc"
const DO_SPACES_URL="https://fra1.digitaloceanspaces.com"
const DO_SPACES_BUCKET="easylaunchnftdospace1"
const PUBLIC_URL="https://easylaunchnftdospace1.fra1.digitaloceanspaces.com"

const s3Client = new AWS.S3({
  endpoint: DO_SPACES_URL,
  region: "fra1",
  credentials: {
    accessKeyId: DO_SPACES_ID,
    secretAccessKey: DO_SPACES_SECRET
  }
});


const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.post(async (req, res) => {                                    // update the receiving of the data to the secure way using Alias key
  const objectId = DOMPurify.sanitize(req.body.objectId.toString());
  const Languages = DOMPurify.sanitize(req.body.Languages.toString());

  await SaveUserParticipationLanguageToMoralisDB(objectId,Languages);

  res.status(201).end("Language updated");
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute
