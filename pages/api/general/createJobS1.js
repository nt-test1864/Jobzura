import middleware from '../../../middleware/middleware.js'
import nextConnect from 'next-connect'
const DOMPurify = require('isomorphic-dompurify');
var Moralis = require("moralis/node");
const fs = require("fs");
const AWS = require('aws-sdk');
var crypto = require("crypto");
import {SaveJobStep1ToMoralisDB} from "../../../JS/DB-pushFunctions.js"
import {GetWalletFromAlias} from '../../../JS/DB-cloudFunctions';
import {ValidateAndReturnMessage, AnyEmpty} from "../../../JS/auth/BackendValidation";


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


apiRoute.post(async (req, res) => {
  console.log(req.body)
  console.log("--------------------------------")
  console.log(req.files)


  //------------------------------------------------------------------------------------------------
  //                           Authentication of the received data
  //------------------------------------------------------------------------------------------------

  const address = DOMPurify.sanitize(req.body.address[0].toString());

  const seller = ValidateAndReturnMessage(address, req.body.message_seller[0].toString(), req.body.signature_seller[0].toString()).toLowerCase();
  const title = ValidateAndReturnMessage(address, req.body.message_title[0].toString(), req.body.signature_title[0].toString());
  const jobCategory = ValidateAndReturnMessage(address, req.body.message_jobCategory[0].toString(), req.body.signature_jobCategory[0].toString());
  const jobSubCategory = ValidateAndReturnMessage(address, req.body.message_jobSubCategory[0].toString(), req.body.signature_jobSubCategory[0].toString());
  const jobDescription = ValidateAndReturnMessage(address, req.body.message_jobDescription[0].toString(), req.body.signature_jobDescription[0].toString());
  const objectId = ValidateAndReturnMessage(address, req.body.message_objectId[0].toString(), req.body.signature_objectId[0].toString());

  if(AnyEmpty([title, jobCategory, jobSubCategory, jobDescription])){ //seller, 
    res.status(420).end("not all signatures are valid");
  }

  // check that the address is associated with the original address (seller)
  const orgWallet = await GetWalletFromAlias(address.toLowerCase());
  console.log(`orgWallet: ${orgWallet}`);

  // if not - terminate
  // if(orgWallet != seller){
  //   res.status(421).end("signatures are not from an Alias associated with this seller");
  // }


  //------------------------------------------------------------------------------------------------
  //                                     The main part
  //------------------------------------------------------------------------------------------------

  console.log(`seller: ${seller}`)
  console.log(`title: ${title}`)
  console.log(`jobCategory: ${jobCategory}`)
  console.log(`jobSubCategory: ${jobSubCategory}`)
  console.log(`jobDescription: ${jobDescription}`)
  console.log(`objectId: ${objectId}`)

  // var images = [];
  // if(req.files.hasOwnProperty('file0')){
  //   images.push(req.files.file0[0])
  // }
  // if(req.files.hasOwnProperty('file1')){
  //   images.push(req.files.file1[0])
  // }
  // if(req.files.hasOwnProperty('file2')){
  //   images.push(req.files.file2[0])
  // }
  // if(req.files.hasOwnProperty('file3')){
  //   images.push(req.files.file3[0])
  // }
  // if(req.files.hasOwnProperty('file4')){
  //   images.push(req.files.file4[0])
  // }

  // console.log("images:")
  // console.log(images) // all images

  // var imageLinks = [];

  // for (let i = 0; i < images.length; i++) {
  //   //const fileName = images[i].originalFilename.replace(/\s/g, '');   // remove empty space
  //   const imageLink = await UploadImageToDigitalOcean(images[i].path)

  //   console.log("link to the file on DO:")
  //   console.log(imageLink)
  //   imageLinks.push(imageLink)
  // }

  const oId = await SaveJobStep1ToMoralisDB(res, objectId, seller, title, jobCategory, jobSubCategory, jobDescription);
  // console.log("==oId",oId);
  // res.status(201).json({ oId: oId }); //.end("job created");
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute



async function UploadImageToDigitalOcean(filePath){

  // get random string for key
  const ext = filePath.split(".");
  const fileName = crypto.randomBytes(20).toString('hex') + "." + ext[ext.length - 1];

  try {
    s3Client.putObject({ // await
    Bucket: DO_SPACES_BUCKET + "/Jobzura",
    Key: fileName,
    Body: fs.createReadStream(filePath),
    ACL: "public-read"
    }, (err, data) => {
      console.log(err)
      console.log(data)
      //console.log("saved file at server: " + fileName)
      //const imageLink = `https://easylaunchnftdospace1.fra1.digitaloceanspaces.com/Jobzura/${fileName}`;
      //return imageLink;
    }) //.promise();

    const imageLink = `https://easylaunchnftdospace1.fra1.digitaloceanspaces.com/Jobzura/${fileName}`;
    return imageLink;

  } catch {
    console.log(e);
    res.status(500).send("Error uploading file");
  } 
}
