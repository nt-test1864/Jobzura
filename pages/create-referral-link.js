import {Button, Input, Form, message} from 'antd';
import axios from "axios";
import React, {useState} from 'react';
import { GetWallet_NonMoralis} from '../JS/local_web3_Moralis.js';
import { SignMessageWithAlias } from "../JS/auth/messageSigning";
import { CheckAndCreateAlias } from "../JS/auth/AliasAuthentication";

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


const CreateReferralLink = () => {

  const onFinish = async (values) => {

    // check if Alias is present in local storage, if not, create a new one
    const res = await CheckAndCreateAlias();
    if(res == false){return false;} 
    
    var formData = new FormData();
    const connectedAddress = (await GetWallet_NonMoralis())[0];

    // run for every parameter to append
    const signedMessage_connectedAddress = await SignMessageWithAlias(connectedAddress);
    formData.append("address", signedMessage_connectedAddress.address);
    formData.append("message_UserWallet", signedMessage_connectedAddress.message);
    formData.append("signature_UserWallet", signedMessage_connectedAddress.signature);

    console.log(`connectedAddress: ${connectedAddress}`)

    axios.post("/api/general/createReferralCode", formData)
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


  return (
    <>
    <div className="container"> 

      <Form
        name="basic"
        {...formItemLayout}
        initialValues={{remember: true}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
        {...tailFormItemLayout}
        >
          <Button type="primary" htmlType="submit">
            Create Referral Link
          </Button>
        </Form.Item>
      </Form>
      </div>
    </>
  );
}

export default CreateReferralLink;