import {Button, Input, Form, Upload, message} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from "axios";
import React, {useState} from 'react';
import { SignMessageWithAlias } from "../JS/auth/messageSigning";
import { CheckAndCreateAlias } from "../JS/auth/AliasAuthentication";


const { TextArea } = Input;


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

  const [imageFiles, setImageFiles] = useState("");
  const [title, setTitle] = useState("");
  const [seller, setSeller] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState(null);
  const [currencyTicker, setCurrencyTicker] = useState(null);

  const onFinish = async(values) => {
    console.log('Success:', values);
    console.log(imageFiles);

    // check if Alias is present in local storage, if not, create a new one
    const res = await CheckAndCreateAlias();
    if(res == false){return false;} 

    
    var formData = new FormData();
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append(`file${i}`, imageFiles[i].originFileObj);
    }

    // run for every parameter to append
    const signedMessage_seller = await SignMessageWithAlias(seller);
    formData.append("address", signedMessage_seller.address);
    formData.append("message_seller", signedMessage_seller.message);
    formData.append("signature_seller", signedMessage_seller.signature);

    const signedMessage_title = await SignMessageWithAlias(title);
    formData.append("message_title", signedMessage_title.message);
    formData.append("signature_title", signedMessage_title.signature);
    
    const signedMessage_price = await SignMessageWithAlias(price);
    formData.append("message_price", signedMessage_price.message);
    formData.append("signature_price", signedMessage_price.signature);

    const signedMessage_description = await SignMessageWithAlias(description);
    formData.append("message_description", signedMessage_description.message);
    formData.append("signature_description", signedMessage_description.signature);

    const signedMessage_currencyTicker = await SignMessageWithAlias(currencyTicker);
    formData.append("message_currencyTicker", signedMessage_currencyTicker.message);
    formData.append("signature_currencyTicker", signedMessage_currencyTicker.signature);
    

    //axios.post("/api/general/createJob", formData)
    axios.post("/api/V2-Firebase/post/createJob", formData)
    .then((res) => {
      if (res.status == 201 ) message.success("data successfully updated!");
      this.fetchExtrashift();
    })
    .catch((err) => {
      message.error("data profile failed to update ...");
    });

    /* */
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  function dummyRequest ({file, onSuccess}) {
    setTimeout(() => {
      onSuccess('OK');
    }, 0);
  };

  function handleUploadChange({fileList}) {
    console.log('fileList', fileList);
    setImageFiles(fileList);
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
          label="Title"
          name="title"
          onChange={(e) => setTitle(e.target.value)}
          rules={[
            {
              required: true,
              message: 'Please add a title!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Seller"
          name="seller"
          onChange={(e) => setSeller(e.target.value)}
          rules={[
            {
              required: true,
              message: 'TEMP: will be reading from wallet later',
            },
          ]}
        >
          <Input />
        </Form.Item>



        <Form.Item
          label="Price"
          name="price"
          onChange={(e) => setPrice(e.target.value)}
          rules={[
            {
              required: true,
              message: 'Please give a price!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item 
          label="Description"
          name="Description"
          onChange={(e) => setDescription(e.target.value)}
          rules={[
            {
              required: true,
              message: 'Please add a description!',
            },
          ]}        
        >
          <TextArea rows={4} />
        </Form.Item>        

        
        <Form.Item 
          label="CurrencyTicker"
          name="CurrencyTicker"
          onChange={(e) => setCurrencyTicker(e.target.value)}
          rules={[
            {
              required: true,
              message: 'Please add a currencyTicker!',
            },
          ]}        
        >
          <TextArea rows={4} />
        </Form.Item>        


      
        {/* improve  the upload component:   https://ant.design/components/upload/    */}
        <Form.Item label="Upload"  valuePropName="fileList" /* */>

          <Upload 
            /* action="/upload.do" */ 
            //customRequest={dummyRequest} 
            listType="picture-card"
            maxCount={5}
            
            //fileList={fileList}
            //onPreview={this.handlePreview}
            //onChange={this.handleUpload}
            onChange={handleUploadChange}
            beforeUpload={() => false}
            accept="image/*"  // .jpg,.png 
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>


        {/*
          Add some data on the timeline/valid until/
        */}

        <Form.Item
        {...tailFormItemLayout}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>

      </Form>
      </div>
    </>
  );
}

export default CreateJob;