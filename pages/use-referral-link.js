import {Button, Input, Form, message} from 'antd';
import axios from "axios";
import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router'
import { GetWallet_NonMoralis } from '../JS/local_web3_Moralis.js';
import { SignMessageWithAlias } from "../JS/auth/messageSigning";
import { CheckAndCreateAlias } from "../JS/auth/AliasAuthentication";

// from layout setting
const formItemLayout = {
  /*
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
  */

  labelCol: {span: 7,},
  wrapperCol:{
    offset: 1,
    span: 8,
  }
};

const tailFormItemLayout = {
  /*
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
  */

  wrapperCol:{
    offset: 8,
    span: 8,
  },
};


const CreateJob = () => {

  const [UserAddress, setUserAddress] = useState("");
  const [ReferralCodeUsed, setReferralCodeUsed] = useState("");

  /*
  const onFinish = (values) => {

    var formData = new FormData();
    formData.append("UserAddress", UserAddress.toLowerCase());
    formData.append("ReferralCodeUsed", ReferralCodeUsed);

    console.log("UserAddress:")
    console.log(UserAddress.toLowerCase())

    console.log("ReferralCodeUsed:")
    console.log(ReferralCodeUsed)

    axios.post("/api/general/useReferralCode", formData)
    .then((res) => {
      if (res.status == 201 ) message.success("data successfully updated!");
      this.fetchExtrashift();
    })
    .catch((err) => {
      message.error("data profile failed to update ...");
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  */





  // ----------------------------------------------------------------------------------------
  // connect wallet - can be used in any file
  async function CheckForReferralCode(){

    console.log(`RefLink.code: ${RefLink.code}`);
    //const UserAddress_test = "0xf6BCd9624DEd17854fb96Ec61E115C6E7d1c3Ed8";



    // check if Alias is present in local storage, if not, create a new one
    const res = await CheckAndCreateAlias();
    if(res == false){return false;} 
    
    var formData = new FormData();
    const connectedAddress = (await GetWallet_NonMoralis())[0];
  
    // run for every parameter to append
    const signedMessage_connectedAddress = await SignMessageWithAlias(connectedAddress);
    formData.append("address", signedMessage_connectedAddress.address);
    formData.append("message_UserAddress", signedMessage_connectedAddress.message);
    formData.append("signature_UserAddress", signedMessage_connectedAddress.signature);

    const signedMessage_ReferralCodeUsed = await SignMessageWithAlias(RefLink.code);
    formData.append("message_ReferralCodeUsed", signedMessage_ReferralCodeUsed.message);
    formData.append("signature_ReferralCodeUsed", signedMessage_ReferralCodeUsed.signature);



    //formData.append("UserAddress", UserAddress_test);
    //formData.append("ReferralCodeUsed", RefLink.code);

    axios.post("/api/general/useReferralCode", formData)
    .then((res) => {
      if (res.status == 201 ) message.success("data successfully updated!");
      this.fetchExtrashift();
    })
    .catch((err) => {
      message.error("data profile failed to update ...");
    });
  }
  // ----------------------------------------------------------------------------------------


  // ----------------------------------------------------------------------------------------
  // has to be used in the file/page where the referral link to direct
  
  const router = useRouter();
  const { name, location } = router.query;
  const query = router.query;  

  useEffect(() => {
    // register these as window variables in the browser (so we can pull them on any page (even on refresh or something like that))
    window.RefLink = {}
    RefLink.code = query.ref;
  });

  // ----------------------------------------------------------------------------------------





  return (
    <>
    <div className="container"> 

      {/*
      <Form
        name="basic"
        {...formItemLayout}
        initialValues={{remember: true}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="UserAddress"
          name="UserAddress"
          onChange={(e) => setUserAddress(e.target.value)}
          rules={[
            {
              required: true,
              message: 'Please add UserAddress!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="ReferralCodeUsed"
          name="ReferralCodeUsed"
          onChange={(e) => setReferralCodeUsed(e.target.value)}
          rules={[
            {
              message: 'add ReferralCodeUsed!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
        {...tailFormItemLayout}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

      */}



      {/* `connect wallet` button - should check the url and see if there is a referral link -> send it to our backend API (wallet address, referral link) */}

      <Button type="primary" htmlType="submit" onClick={CheckForReferralCode}>
        Connect Wallet
      </Button>

      </div>
    </>
  );
}

export default CreateJob;