import React, { Fragment } from "react";
import {
  CancelBuyerContract_Moralis, 
  AcceptOfferSeller_Moralis,
  ConfirmDelivery_Moralis,
  StartDispute_Moralis,
  ReturnPayment_Moralis,
  ClaimFunds_Moralis,
  GetWallet_NonMoralis, 
} from '../../JS/local_web3_Moralis.js';
const DOMPurify = require("isomorphic-dompurify");
import { useRouter } from "next/router.js";
import { useQuery } from "react-query";
import axios from "axios";
import { SignMessageWithAlias } from "../../JS/auth/messageSigning";
import { CheckAndCreateAlias } from "../../JS/auth/AliasAuthentication";

function ContractDetails() {
  const router = useRouter();
  const contractID = router.query.contractID;

  const fetchContractDetails = async (contractID) => {
    //const contractDetails = await axios.get(`/api/get/Contract?contractID=${contractID}`);
    const contractDetails = await axios.get(`/api/V2-Firebase/get/Contract?contractID=${contractID}`);
    return contractDetails.data;
  }

  const { data, isLoading, isError } = useQuery(
    ["ContractDetails", contractID],
    () => fetchContractDetails(contractID),
    {
      refetchOnWindowFocus: false,
    }
  );

  async function GetUserReferralChain(userWallet){
    //const data = await fetch(`../api/get/ReferralChain3?userWallet=${userWallet}`)
    //  .then((res) => res.json());
    //return data;

    return ["0x1591C783EfB2Bf91b348B6b31F2B04De1442836c"];
  }
  

  const contractDetails = data;

  console.log(contractDetails);

  if(isLoading) {
    return <h1>Loading...</h1>
  }
  
  console.log(contractDetails);

  if(data) {

    return (
      <Fragment>
        <div className="sectionMain">
          <h2 className="address">Contract ID : {contractDetails[0].name.JobId}</h2>

          <h2 className="address">Title : {contractDetails[0].name.Title}</h2>
          <h2 className="address">Description : {contractDetails[0].name.Description}</h2>
          <h2 className="address">Price : {contractDetails[0].name.Price}</h2>
          <h2 className="address">Buyer : {contractDetails[0].name.BuyerWallet}</h2>
          <h2 className="address">Seller : {contractDetails[0].name.SellerWallet}</h2>
          <h2 className="address">State : {contractDetails[0].name.State}</h2>

          {/*
            add a cancel contract button (available only before seller accepts)  - initially visible to all (then only the connected wallet that is buyer of the contract)

            after seller accepts:
            Seller options:  claim funds, return funds
            Buyer options: start dispute, confirm delivery
          */}


          <br></br>
          <br></br>
          
          <div>
            Before Seller accepts the contract, the Buyer can `Cancel` contract and the Seller can `Accept` the contract
            <br></br>
          
            <input
              type="submit"
              value="Accept Contract"
              onClick={async() =>
                AcceptOfferSeller_Moralis(contractDetails[0].name.CurrencyTicker, contractDetails[0].name.JobId, await GetUserReferralChain((await GetWallet_NonMoralis())[0]))
                .then(async (transactionHash) => {

                  // check if Alias is present in local storage, if not, create a new one
                  const res = await CheckAndCreateAlias();
                  if(res == false){return false;} 

                  var formData = new FormData();
                  const connectedAddress = (await GetWallet_NonMoralis())[0];


                  // run for every parameter to append
                  const signedMessage_connectedAddress = await SignMessageWithAlias(connectedAddress);
                  formData.append("address", signedMessage_connectedAddress.address);
                  formData.append("message_BuyerWallet", signedMessage_connectedAddress.message);
                  formData.append("signature_BuyerWallet", signedMessage_connectedAddress.signature);

                  const signedMessage_SellerWallet = await SignMessageWithAlias(contractDetails[0].name.SellerWallet);
                  formData.append("message_SellerWallet", signedMessage_SellerWallet.message);
                  formData.append("signature_SellerWallet", signedMessage_SellerWallet.signature);

                  const signedMessage_transactionHash = await SignMessageWithAlias(transactionHash);
                  formData.append("message_transactionHash", signedMessage_transactionHash.message);
                  formData.append("signature_transactionHash", signedMessage_transactionHash.signature);

                  const signedMessage_objectId = await SignMessageWithAlias(contractDetails[0].name.objectId);
                  formData.append("message_objectId", signedMessage_objectId.message);
                  formData.append("signature_objectId", signedMessage_objectId.signature);

                  
                  //formData.append("BuyerWallet", connectedAddress);
                  //formData.append("SellerWallet", contractDetails.SellerWallet);
                  //formData.append("transactionHash", transactionHash);
                  //formData.append("objectId", contractDetails.objectId);

                  var xhr = new XMLHttpRequest();
                  xhr.open("POST", "/api/contractActions/acceptContractBySeller", false);
                  xhr.onload = function () {
                    console.log("contract accepted");
                  };
                  xhr.send(formData);
                })
                .catch((error) => {
                  console.error(error);
                  console.log(
                    "accept Offer error code: " + error.code
                  );
                  console.log(
                    "accept Offer error message: " + error.message
                  );
                  if (error.data && error.data.message) {
                    console.log(error.data.message);
                  } else {
                    console.log(error.message);
                  }
                  process.exitCode = 1;
                })
              }
            ></input>


            <input
              type="submit"
              value="Cancel Contract"
              onClick={() =>
                CancelBuyerContract_Moralis(contractDetails[0].name.CurrencyTicker, contractDetails[0].name.JobId)
                .then(async (transactionHash) => {
                  
                  // check if Alias is present in local storage, if not, create a new one
                  const res = await CheckAndCreateAlias();
                  if(res == false){return false;} 
                  
                  var formData = new FormData();
                  const connectedAddress = (await GetWallet_NonMoralis())[0];
                

                  // run for every parameter to append
                  const signedMessage_connectedAddress = await SignMessageWithAlias(connectedAddress);
                  formData.append("address", signedMessage_connectedAddress.address);
                  formData.append("message_BuyerWallet", signedMessage_connectedAddress.message);
                  formData.append("signature_BuyerWallet", signedMessage_connectedAddress.signature);

                  const signedMessage_transactionHash = await SignMessageWithAlias(transactionHash);
                  formData.append("message_transactionHash", signedMessage_transactionHash.message);
                  formData.append("signature_transactionHash", signedMessage_transactionHash.signature);

                  const signedMessage_objectId = await SignMessageWithAlias(contractDetails[0].name.objectId);
                  formData.append("message_objectId", signedMessage_objectId.message);
                  formData.append("signature_objectId", signedMessage_objectId.signature);


                  //formData.append("userWallet", connectedAddress);
                  //formData.append("transactionHash", transactionHash);
                  //formData.append("objectId", contractDetails[0].name.objectId);

                  var xhr = new XMLHttpRequest();
                  xhr.open("POST", "/api/contractActions/cancelContract", false);
                  xhr.onload = function () {
                    console.log("contract canceled");
                  };
                  xhr.send(formData);
                })
                .catch((error) => {
                  console.error(error);
                  console.log(
                    "Cancel Offer error code: " + error.code
                  );
                  console.log(
                    "Cancel Offer error message: " + error.message
                  );
                  if (error.data && error.data.message) {
                    console.log(error.data.message);
                  } else {
                    console.log(error.message);
                  }
                  process.exitCode = 1;
                })
              }
            ></input>
          </div>

          <br></br>
          <br></br>

          <div>
            After the Seller accepts the contract, the contract is `in progress`. The Buyer can `Start a Dispute` or `Confirm the Delivery`. While the Seller can `Return the Payment` or `Claim the Funds`
            <br></br>

            {/*
            
              buttons for:
                Start Dispute
                Confirm Delivery

                Return Payment
                Claim the Funds

            */}

            For the Buyer:
            <br></br>


            <input
              className="button rounded secondary small"
              type="submit"
              value="Confirm Delivery"
              onClick={() =>
                ConfirmDelivery_Moralis(contractDetails[0].name.CurrencyTicker, contractDetails[0].name.JobId)
                  .then(async (transactionHash) => {

                    // check if Alias is present in local storage, if not, create a new one
                    const res = await CheckAndCreateAlias();
                    if(res == false){return false;} 
                    
                    var formData = new FormData();
                    const connectedAddress = (await GetWallet_NonMoralis())[0];


                    // run for every parameter to append
                    const signedMessage_connectedAddress = await SignMessageWithAlias(connectedAddress);
                    formData.append("address", signedMessage_connectedAddress.address);
                    formData.append("message_BuyerWallet", signedMessage_connectedAddress.message);
                    formData.append("signature_BuyerWallet", signedMessage_connectedAddress.signature);

                    const signedMessage_transactionHash = await SignMessageWithAlias(transactionHash);
                    formData.append("message_transactionHash", signedMessage_transactionHash.message);
                    formData.append("signature_transactionHash", signedMessage_transactionHash.signature);

                    const signedMessage_objectId = await SignMessageWithAlias(contractDetails[0].name.objectId);
                    formData.append("message_objectId", signedMessage_objectId.message);
                    formData.append("signature_objectId", signedMessage_objectId.signature);


                    //formData.append("BuyerWallet", contractDetails[0].name.BuyerWallet);
                    //formData.append("transactionHash", transactionHash);
                    //formData.append("objectId", contractDetails[0].name.objectId);

                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", "/api/contractActions/confirmDelivery", false);
                    xhr.onload = function () {
                      console.log("Delivery confirmed");
                    };
                    xhr.send(formData);
                  })
                  .catch((error) => {
                    console.error(error);
                    console.log("accept Offer error code: " + error.code);
                    if (error.data && error.data.message) {
                      console.log(error.data.message);
                    } else {
                      console.log(error.message);
                    }
                    process.exitCode = 1;
                  })
              }
            ></input>

            <input
              className="rounded button green small"
              type="submit"
              value="Start Dispute"
              onClick={() =>
                StartDispute_Moralis(contractDetails[0].name.CurrencyTicker, contractDetails[0].name.JobId)
                  .then(async (transactionHash) => {

                    // check if Alias is present in local storage, if not, create a new one
                    const res = await CheckAndCreateAlias();
                    if(res == false){return false;} 
                    
                    var formData = new FormData();
                    const connectedAddress = (await GetWallet_NonMoralis())[0];


                    // run for every parameter to append
                    const signedMessage_connectedAddress = await SignMessageWithAlias(connectedAddress);
                    formData.append("address", signedMessage_connectedAddress.address);
                    formData.append("message_BuyerWallet", signedMessage_connectedAddress.message);
                    formData.append("signature_BuyerWallet", signedMessage_connectedAddress.signature);

                    const signedMessage_SellerWallet = await SignMessageWithAlias(contractDetails[0].name.SellerWallet);
                    formData.append("message_SellerWallet", signedMessage_SellerWallet.message);
                    formData.append("signature_SellerWallet", signedMessage_SellerWallet.signature);

                    const signedMessage_transactionHash = await SignMessageWithAlias(transactionHash);
                    formData.append("message_transactionHash", signedMessage_transactionHash.message);
                    formData.append("signature_transactionHash", signedMessage_transactionHash.signature);

                    const signedMessage_objectId = await SignMessageWithAlias(contractDetails[0].name.objectId);
                    formData.append("message_objectId", signedMessage_objectId.message);
                    formData.append("signature_objectId", signedMessage_objectId.signature);



                    //formData.append("BuyerWallet", contractDetails[0].name.BuyerWallet);
                    //formData.append("SellerWallet", contractDetails[0].name.SellerWallet);
                    //formData.append("transactionHash", transactionHash);
                    //formData.append("objectId", contractDetails[0].name.objectId);

                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", "/api/contractActions/startDispute", false);
                    xhr.onload = function () {
                      console.log("Dispute started");
                    };
                    xhr.send(formData);
                  })
                  .catch((error) => {
                    console.error(error);
                    console.log("accept Offer error code: " + error.code);
                    if (error.data && error.data.message) {
                      console.log(error.data.message);
                    } else {
                      console.log(error.message);
                    }
                    process.exitCode = 1;
                  })
              }
            ></input>



            <br></br>
            <br></br>

            For the Seller:
            <br></br>

            <input
              className="button primary rounded small"
              type="submit"
              value="Return Payment"
              onClick={() =>
                ReturnPayment_Moralis(contractDetails[0].name.CurrencyTicker, contractDetails[0].name.JobId)
                  .then(async (transactionHash) => {

                    // check if Alias is present in local storage, if not, create a new one
                    const res = await CheckAndCreateAlias();
                    if(res == false){return false;} 
                    
                    var formData = new FormData();
                    const connectedAddress = (await GetWallet_NonMoralis())[0];


                    // run for every parameter to append
                    const signedMessage_connectedAddress = await SignMessageWithAlias(connectedAddress);
                    formData.append("address", signedMessage_connectedAddress.address);
                    formData.append("message_SellerWallet", signedMessage_connectedAddress.message);
                    formData.append("signature_SellerWallet", signedMessage_connectedAddress.signature);

                    const signedMessage_transactionHash = await SignMessageWithAlias(transactionHash);
                    formData.append("message_transactionHash", signedMessage_transactionHash.message);
                    formData.append("signature_transactionHash", signedMessage_transactionHash.signature);

                    const signedMessage_objectId = await SignMessageWithAlias(contractDetails[0].name.objectId);
                    formData.append("message_objectId", signedMessage_objectId.message);
                    formData.append("signature_objectId", signedMessage_objectId.signature);



                    //formData.append("SellerWallet", connectedAddress);
                    //formData.append("transactionHash", transactionHash);
                    //formData.append("objectId", contractDetails[0].name.objectId);

                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", "/api/contractActions/returnPayment", false);
                    xhr.onload = function () {
                      console.log("Payment returned");
                    };
                    xhr.send(formData);
                  })
                  .catch((error) => {
                    console.error(error);
                    console.log("accept Offer error code: " + error.code);
                    if (error.data && error.data.message) {
                      console.log(error.data.message);
                    } else {
                      console.log(error.message);
                    }
                    process.exitCode = 1;
                  })
              }
            ></input>

            <input
              className="button rounded green small"
              type="submit"
              value="Claim Funds"
              onClick={() =>
                ClaimFunds_Moralis(contractDetails[0].name.CurrencyTicker, contractDetails[0].name.JobId)
                  .then(async (transactionHash) => {

                    // check if Alias is present in local storage, if not, create a new one
                    const res = await CheckAndCreateAlias();
                    if(res == false){return false;} 
                    
                    var formData = new FormData();
                    const connectedAddress = (await GetWallet_NonMoralis())[0];


                    // run for every parameter to append
                    const signedMessage_connectedAddress = await SignMessageWithAlias(connectedAddress);
                    formData.append("address", signedMessage_connectedAddress.address);
                    formData.append("message_SellerWallet", signedMessage_connectedAddress.message);
                    formData.append("signature_SellerWallet", signedMessage_connectedAddress.signature);

                    const signedMessage_transactionHash = await SignMessageWithAlias(transactionHash);
                    formData.append("message_transactionHash", signedMessage_transactionHash.message);
                    formData.append("signature_transactionHash", signedMessage_transactionHash.signature);

                    const signedMessage_objectId = await SignMessageWithAlias(contractDetails[0].name.objectId);
                    formData.append("message_objectId", signedMessage_objectId.message);
                    formData.append("signature_objectId", signedMessage_objectId.signature);


                    //formData.append("SellerWallet", connectedAddress);
                    //formData.append("transactionHash", transactionHash);
                    //formData.append("objectId", contractDetails[0].name.objectId);

                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", "/api/contractActions/claimFunds", false);
                    xhr.onload = function () {
                      console.log("Funds claimed");
                    };
                    xhr.send(formData);
                  })
                  .catch((error) => {
                    console.error(error);
                    console.log("accept Offer error code: " + error.code);
                    if (error.data && error.data.message) {
                      console.log(error.data.message);
                    } else {
                      console.log(error.message);
                    }
                    process.exitCode = 1;
                  })
              }
            ></input>
          </div>
        </div>
      </Fragment>
    );
  }
}


export default ContractDetails;