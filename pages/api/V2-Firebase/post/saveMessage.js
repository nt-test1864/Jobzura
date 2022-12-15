import middleware from '../../../../middleware/middleware.js'
import nextConnect from 'next-connect'
const DOMPurify = require('isomorphic-dompurify');
const fs = require("fs");
const AWS = require('aws-sdk');
var crypto = require("crypto");
import {ValidateAndReturnMessage, AnyEmpty} from "../../../../JS/auth/BackendValidation";
import admin from "../../../../_firebase-admin";


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

  const sender = ValidateAndReturnMessage(address, req.body.message_sender[0].toString(), req.body.signature_sender[0].toString()).toLowerCase();
  const receiver = ValidateAndReturnMessage(address, req.body.message_receiver[0].toString(), req.body.signature_receiver[0].toString());
  const message = ValidateAndReturnMessage(address, req.body.message_message[0].toString(), req.body.signature_message[0].toString());

  if(AnyEmpty([sender, receiver, message])){
    res.status(420).end("not all signatures are valid");
  }

  // check that the address is associated with the original address (seller)
  
  //const orgWallet = await GetWalletFromAlias(address.toLowerCase());
  const orgWallet = "HARD_CODED_FOR_NOW";
  console.log(`orgWallet: ${orgWallet}`);

  // if not - terminate
  //if(orgWallet != seller){
  //  res.status(421).end("signatures are not from an Alias associated with this seller");
  //}


  //------------------------------------------------------------------------------------------------
  //                                     The main part
  //------------------------------------------------------------------------------------------------

  console.log(`sender: ${sender}`)
  console.log(`receiver: ${receiver}`)
  console.log(`message: ${message}`)


  await SaveMessageToFirebaseDB(sender.toLowerCase(), receiver.toLowerCase(), message);

  res.status(201).end("Message saved to DB");
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute




async function SaveMessageToFirebaseDB(sender, receiver, message){

  console.log("SaveMessageToFirebaseDB...");
  var concatedAddress;

  if(sender.localeCompare(receiver) == -1){
    concatedAddress = sender + receiver;
  } else {
    concatedAddress = receiver + sender;
  }

  console.log("concatedAddress: " + concatedAddress);

  const Message = {
    sender: sender,
    receiver: receiver,
    message: message,
    Created: new Date()
  }
  
  const epoch = new Date().getTime();
  await admin.firestore().collection('messages').doc(concatedAddress).set(Message, { merge: false });
}

