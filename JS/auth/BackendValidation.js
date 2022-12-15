import { VerifyMessage } from "./messageSigning";
const DOMPurify = require('isomorphic-dompurify');


export function ValidateAndReturnMessage(address, messageVariable, signatureVariable){
  const message = DOMPurify.sanitize(messageVariable);
  const signature = DOMPurify.sanitize(signatureVariable);
  const isValid = VerifyMessage(message, address, signature);
  console.log(`isValid: ${isValid}`); 

  return (isValid) ? message : "";
}

export function AnyEmpty(arr){
  for (let i = 0; i < arr.length; i++)
  {
    if(arr[i].length === 0){return true;}
  }
  return false;
}