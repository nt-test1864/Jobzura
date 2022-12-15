import {Button, Input, Form, message} from 'antd';
import React, {useState, useEffect} from 'react';
import {
  GetWallet_NonMoralis, 
  clonedContractsIndex_Moralis, 
  CreateEscrow_Moralis, 
  AcceptOfferSeller_Moralis,
  ConfirmDelivery_Moralis,
  CancelSellerContract_Moralis
} from "../JS/local_web3_Moralis";
import { sha256 } from "js-sha256";


// from layout setting
const formItemLayout = {
  labelCol: {span: 7,},
  wrapperCol:{
    offset: 1,
    span: 8,
  }
};

const tailFormItemLayout = {
  wrapperCol:{
    offset: 8,
    span: 8,
  },
};

async function GetUserReferralChain(userWallet){
  const data = await fetch(`./api/get/ReferralChain3?userWallet=${userWallet}`)
    .then((res) => res.json())
    ; //.then((json) => setData(json)); // uncomment this line to see the data in the console

  return data;
}



export default function RunRefTx() {


  var _14DaysFromNow = new Date(Date.now() + 12096e5);

  async function CreateContractBuyerTx(){
    CreateEscrow_Moralis(
      true,
      (await GetWallet_NonMoralis())[0],       
      0.001, // price
      "ETH", // expected values: `ETH`, `USDC`
      await GetUserReferralChain((await GetWallet_NonMoralis())[0]), //"0x1591C783EfB2Bf91b348B6b31F2B04De1442836c",  // referrerAddress
      24 * 1, // the value should be in hours
      sha256("someText"),
      Math.floor(_14DaysFromNow.getTime() / 1000),
      "0x80038953cE1CdFCe7561Abb73216dE83F8baAEf0,0x1591C783EfB2Bf91b348B6b31F2B04De1442836c",
      ""
    )
    .then(async (transactionHash) => {

      var formData = new FormData();
      var xhr = new XMLHttpRequest();

      // read the current number of agreements to figure out what is the agreement index for this case
      const index = (await clonedContractsIndex_Moralis()) - 1;
      console.log("new index: " + index);
      formData.append("index", index);
      formData.append("hashDescription", sha256("someText"));
      formData.append("transactionHash", transactionHash);
      formData.append("OfferValidUntil", Math.floor(_14DaysFromNow.getTime() / 1000));
      formData.append("TimeToDeliver", 1);
      formData.append("CurrencyTicker", "ETH");
      formData.append("ChainID", 137); // polygon
      formData.append("PersonalizedOffer", ["0x80038953cE1CdFCe7561Abb73216dE83F8baAEf0"]);
      formData.append("Arbiters", []);

      const connectedAddress = await GetWallet_NonMoralis();
      formData.append("BuyerWallet", connectedAddress);

      // added now manually:
      formData.append("Title", "Title");
      formData.append("Description", "Description");
      formData.append("hashDescription", "hashDescription");
      formData.append("Price", 0.001);


      xhr.open("POST", "/api/contractActions/createOfferByBuyer_obsolete", false);                                           // implement!


      xhr.onload = function () {
        console.log("contract created");
      };
      xhr.send(formData);
    })
    .catch((error) => {
      console.error(error);
      console.log("create offer error code: " + error.code);
      console.log("create offer error message: " + error.message);
      if (error.data && error.data.message) {
        console.log(error.data.message);
      } else {
        console.log(error.message);
      }
      process.exitCode = 1;
    });
  }

  async function AcceptContractSellerTx(){                  
    AcceptOfferSeller_Moralis(  // SC: (uint256 index, uint256 _referralCommision, address referrerAddress)
      0,
      await GetUserReferralChain((await GetWallet_NonMoralis())[0])  // "0xfDB177128E6DBc71b7012761984558123CCD5224"
    ) 
    .then(async (transactionHash) => {

      var formData = new FormData();
      formData.append("BuyerWallet", "0x80038953cE1CdFCe7561Abb73216dE83F8baAEf0");   // BuyerWallet

      const connectedAddress = await GetWallet_NonMoralis();
      formData.append("SellerWallet", connectedAddress);
      formData.append("PersonalizedOffer", "true");
      formData.append("transactionHash", transactionHash);
      formData.append("objectId", "Fk9xWN1HVZ1zinH3cEllZTrr");      // objectId - need to either get it directly from DB/fetch, or update it every time manually....

      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/api-acceptedOfferBySeller", false);
      xhr.onload = function () {
        console.log("Contract accepted");
      };
      xhr.send(formData);
    })
    .catch((error) => {
      console.error(error);
      console.log("accept offer error code: " + error.code);
      console.log("accept offer error message: " + error.message);
      if (error.data && error.data.message) {
        console.log(error.data.message);
      } else {
        console.log(error.message);
      }
      process.exitCode = 1;
    })
  }


  async function ConfirmDeliveryTx(){
    ConfirmDelivery_Moralis(0)   // index
    .then(async (transactionHash) => {

      var formData = new FormData();
      const connectedAddress = await GetWallet_NonMoralis();
      formData.append("BuyerWallet", connectedAddress);
      formData.append("transactionHash", transactionHash);
      formData.append("objectId", "Fk9xWN1HVZ1zinH3cEllZTrr");    // objectId - need to either get it directly from DB/fetch, or update it every time manually....

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
      console.log("accept Offer error message: " + error.message);
      if (error.data && error.data.message) {
        console.log(error.data.message);
      } else {
        console.log(error.message);
      }
      process.exitCode = 1;
    })
  }


  async function CancelSellerContractTx(){
    CancelSellerContract_Moralis(0)
    .then(async (transactionHash) => {

      var formData = new FormData();
      const connectedAddress = await GetWallet_NonMoralis();
      formData.append("userWallet", connectedAddress);
      formData.append("transactionHash", transactionHash);
      formData.append("objectId", objectId);

      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/contractActions/cancelContract", false);
      xhr.onload = function () {
        console.log("contract canceled");
      };
      xhr.send(formData);
    })
    .catch((error) => {
      console.error(error);
      console.log("accept Offer error code: " + error.code);
      console.log("accept Offer error message: " + error.message);
      if (error.data && error.data.message) {
        console.log(error.data.message);
      } else {
        console.log(error.message);
      }
      process.exitCode = 1;
    })
  }


  return (
    <>
    <div className="container"> 

      {/* `connect wallet` button - should check the url and see if there is a referral link -> send it to our backend API (wallet address, referral link) */}

      <Button type="primary" htmlType="submit" onClick={CreateContractBuyerTx}>
        CreateContractBuyerTx
      </Button>

      <Button type="primary" htmlType="submit" onClick={AcceptContractSellerTx}>
        AcceptContractSellerTx
      </Button>

      <Button type="primary" htmlType="submit" onClick={ConfirmDeliveryTx}>
        ConfirmDeliveryTx
      </Button>

      <Button type="primary" htmlType="submit" onClick={CancelSellerContractTx}>
        CancelContractTx
      </Button>


      </div>
    </>
  );
}