import { Fragment, useState, useEffect } from 'react';
import {Input, Form, Upload, message} from 'antd'; //Button, 
import axios from "axios";
import { SignMessageWithAlias } from "../../JS/auth/messageSigning";
import { CheckAndCreateAlias } from "../../JS/auth/AliasAuthentication";
import Select from "react-dropdown-select";

// import 'antd/dist/antd.css';

// import JobStep1 from "./create-job-step1";
// import JobStep2 from "./create-job-step2";
// import JobStep3 from "./create-job-step3";
import JobStep4 from "./create-job-step4";

import { skills } from './../../data/skills';

import Button from "./../ui/Button";
// import PlaceholderIc from "./../icons/Placeholder";
import PlusIc from "./../icons/Plus";

function JobForm(props) {
  const { jobDetails, seller } = props;
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [formSent, setFormSent] = useState(false);
  const createJobSteps = [
    {
      count: 1,
      label: "Overview",
    },
    {
      count: 2,
      label: "Pricing",
    },
    {
      count: 3,
      label: "Gallery",
    },
    {
      count: 4,
      label: "Publish",
    }
  ]

  // step 1
  const [title, setTitle] = useState(jobDetails ? jobDetails[0]?.name.Title.stringValue : '');
  const [jobCategory, setJobCategory] = useState(jobDetails ? jobDetails[0]?.name.Category.stringValue : '');
  const [jobSkills, setJobSkills] = useState(jobDetails ? jobDetails[0]?.name.Skills.stringValue : '');
  const [jobDescription, setJobDescription] = useState(jobDetails ? jobDetails[0]?.name.Description.stringValue : '');
  const [imageLinks, setImageLinks] = useState(jobDetails ? jobDetails[0]?.name.ImageLinks.arrayValue.values : []); 
  const jobId = jobDetails ? jobDetails[0]?.name.JobId.stringValue : "";


  const jobAllImages = [...new Set(imageLinks?.map(item => item.stringValue))]
  const jobImagesOptions = jobAllImages.map((image, idx) => ({
    uid: (idx+1),
    // name: idx+'img.png',
    status: 'done',
    url: image,
  }));
 
  const jobAllCategories = [...new Set(skills.map(item => item.category))]
  const jobCategoryOptions = jobAllCategories.map((category) => ({
    label: category,
    value: category
  }));
  
  const filterSubCategories = skills.filter((skills) => {
    return skills.category === jobCategory;
  });
  const jobAllSubCategories = [...new Set(filterSubCategories.map(item => item.skill))]
  const jobSkillsOptions = jobAllSubCategories.map((skills) => ({
    label: skills,
    value: skills
  }));
  
 



  // step 2
  const [jobDescriptionBasic, setJobDescriptionBasic] = useState("");
  const [jobPriceCurrencyBasic, setJobPriceCurrencyBasic] = useState(jobDetails?jobDetails[0]?.name.CurrencyTicker.stringValue:'');
  const [jobPriceBasic, setJobPriceBasic] = useState(jobDetails?jobDetails[0]?.name.Price.stringValue:'');
  const [jobDeliveryTime, setJobDeliveryTime] = useState(jobDetails?jobDetails[0]?.name.TimeToDeliver.stringValue:'');

  const [jobDescriptionStandard, setJobDescriptionStandard] = useState("");
  const [jobPriceCurrencyStandard, setJobPriceCurrencyStandard] = useState("");
  const [jobPriceStandard, setJobPriceStandard] = useState("");

  const [jobDescriptionPremium, setJobDescriptionPremium] = useState("");
  const [jobPriceCurrencyPremium, setJobPriceCurrencyPremium] = useState("");
  const [jobPricePremium, setJobPricePremium] = useState("");

  const priceCurrencyOptions = [
    {
      label: "ETH",
      value: "ETH",
      disabled: true
    },
    {
      label: "BNB",
      value: "BNB",
    },
    {
      label: "MATIC",
      value: "MATIC",
    },
  ]

  const jobDeliveryOptions = [
    {
      label: "1 Day",
      value: "1",
    },
    {
      label: "3 Day",
      value: "3",
    },
    {
      label: "7 Day",
      value: "7",
    },
    {
      label: "14 Day",
      value: "14",
    },
  ]




  // step 3
  const [imageFiles, setImageFiles] = useState([]);
  
  function handleUploadChange({fileList}) {
    console.log('fileList', fileList);
    setImageFiles(fileList);
  };


  const onFinish = async() => {
    // check if Alias is present in local storage, if not, create a new one
    const res = await CheckAndCreateAlias();
    if(res == false){return false;} 

    if(title=='') return true; // ?

    var formData = new FormData();

    const signedMessage_seller = await SignMessageWithAlias(seller);
    formData.append("address", signedMessage_seller.address);
    formData.append("message_seller", signedMessage_seller.message);
    formData.append("signature_seller", signedMessage_seller.signature);

    const signedMessage_jobId = await SignMessageWithAlias(jobId);
    formData.append("message_jobId", signedMessage_jobId.message);
    formData.append("signature_jobId", signedMessage_jobId.signature);

    const signedMessage_title = await SignMessageWithAlias(title);
    formData.append("message_title", signedMessage_title.message);
    formData.append("signature_title", signedMessage_title.signature);

    const signedMessage_price = await SignMessageWithAlias(jobPriceBasic);
    formData.append("message_price", signedMessage_price.message);
    formData.append("signature_price", signedMessage_price.signature);

    const signedMessage_currencyTicker = await SignMessageWithAlias(jobPriceCurrencyBasic);
    formData.append("message_currencyTicker", signedMessage_currencyTicker.message);
    formData.append("signature_currencyTicker", signedMessage_currencyTicker.signature);

    const signedMessage_description = await SignMessageWithAlias(jobDescription);
    formData.append("message_description", signedMessage_description.message);
    formData.append("signature_description", signedMessage_description.signature);
    
    const signedMessage_jobCategory = await SignMessageWithAlias(jobCategory);
    formData.append("message_jobCategory", signedMessage_jobCategory.message);
    formData.append("signature_jobCategory", signedMessage_jobCategory.signature);

    const signedMessage_jobSkills = await SignMessageWithAlias(jobSkills);
    formData.append("message_jobSkills", signedMessage_jobSkills.message);
    formData.append("signature_jobSkills", signedMessage_jobSkills.signature);

    const signedMessage_timeToDeliver = await SignMessageWithAlias(jobDeliveryTime);
    formData.append("message_timeToDeliver", signedMessage_timeToDeliver.message);
    formData.append("signature_timeToDeliver", signedMessage_timeToDeliver.signature);

    for (let i = 0; i < imageFiles.length; i++) {
      formData.append(`file${i}`, imageFiles[i].originFileObj);
    }

    axios.post("/api/V2-Firebase/post/createJob_Main", formData)
    .then((res) => {
      if (res.status == 201 ) message.success("data successfully updated!");
      this.fetchExtrashift();
    })
    .catch((err) => {
      message.error("data profile failed to update ...");
    });
  }





  // step 3-new bigbazaa
  //let selectedJobImages=jobDetails?jobDetails[0]?.name.ImageLinks:'';
  useEffect(() => {
    if(previousStep==3){
      
      if(!formSent) // no idea why it wants to send it twice otherwise
      {
        onFinish();
        setFormSent(true);
      }

    } else if (currentStep==4){
      // send all 'steps' together in 1 go
    }
  }, [currentStep]);


  function validAndNextStep() {
    setPreviousStep(currentStep);
    setCurrentStep(currentStep + 1);
  }

  function backStep() {
    setCurrentStep(currentStep - 1);
  }

  return (
    <Fragment>
      <div className="CreateJobSteps">
        <div className="createJobWrapper">
          <ul>
            {createJobSteps.map((step, index) =>
              <li key={index} className={currentStep > step.count ? "completedStep" : currentStep === step.count ? "currentStep" : ""}><i>{step.count}</i><span>{step.label}</span></li>
            )}
          </ul>
        </div>
      </div>
      <div className="createJobWrapper">
        <div className="createJobContainer">

          {currentStep === 1 &&
            // <JobStep1
            //   selectedJobTitle={jobDetails?jobDetails[0].name.Title:''}
            //   selectedJobCategory={jobDetails?jobDetails[0].name.Category:''}
            //   selectedJobSkills={jobDetails?jobDetails[0].name.Category:''}
            //   selectedJobDescription={jobDetails?jobDetails[0].name.Description:''}
            // />
            <div>
              <div className="formRow">
                <div className="formCol">
                  <h3>Job title</h3>
                  <p>As your Gig storefront, your title is the most important place to include keywords that buyers would likely use to search for a service like yours.</p>
                  <input
                    type="text"
                    value={title}
                    placeholder="Enter a title"
                    className="formControl"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="formRow">
                <div className="formCol">
                  <h3>Category</h3>
                  <p>Choose the category and sub-category most suitable for your Gig.</p>
                  <Select
                    options={jobCategoryOptions}
                    values={[
                      jobCategoryOptions.find((opt) => opt.value === jobCategory)!==undefined?jobCategoryOptions.find((opt) => opt.value === jobCategory):""
                    ]}
                    onChange={(opt) => setJobCategory(opt[0]?opt[0]['value']:'')}
                  />
                  <Select
                    className="mt-15"
                    options={jobSkillsOptions}
                    values={[
                      jobSkillsOptions.find((opt) => opt.value === jobSkills)!==undefined?jobSkillsOptions.find((opt) => opt.value === jobSkills):""
                      //jobSkillsOptions.find((opt) => opt.value === jobSkills)
                    ]}
                    onChange={(opt) => setJobSkills(opt[0]?opt[0]['value']:'')}
                    //onChange={function(opt){return console.log("----------------",opt)}}
                  />
                </div>
              </div>

              <div className="formRow">
                <div className="formCol">
                  <h3>Description</h3>
                  <p>Briefly Describe Your Gig.</p>
                  <textarea
                    rows="8"
                    defaultValue={jobDescription}
                    placeholder=""
                    className="formControl textarea"
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
          }

          {currentStep === 2 &&
          //   <JobStep2
          //   selectedJobCurrencyTicker={jobDetails?jobDetails[0].name.CurrencyTicker:''}
          //   selectedJobPrice={jobDetails?jobDetails[0].name.Price:''}
          //   selectedJobTimeToDeliver={jobDetails?jobDetails[0].name.TimeToDeliver:''}
          // />
            <div>
              <div className="stepFormBlockMain">
                <div className="stepFormContainer">

                  <div className="formRow">
                    <div className="formCol">
                      <h3>Price</h3>
                      <div className="mergeControl">
                        <Select
                          options={priceCurrencyOptions}
                          values={[
                            priceCurrencyOptions.find((opt) => opt.value === jobPriceCurrencyBasic)!==undefined?priceCurrencyOptions.find((opt) => opt.value === jobPriceCurrencyBasic):""
                            // priceCurrencyOptions.find((opt) => opt.value === jobPriceCurrencyBasic)
                          ]}
                          onChange={(opt) => setJobPriceCurrencyBasic(opt[0]?opt[0]['value']:'')}
                          className="jobCurrencyDropdown"
                        />
                        <input
                          type="text"
                          value={jobPriceBasic}
                          placeholder="Enter a price"
                          className="formControl"
                          onChange={(e) => setJobPriceBasic(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="formCol">
                      <h3>Delivery time</h3>
                      <Select
                        options={jobDeliveryOptions}
                        values={[
                          jobDeliveryOptions.find((opt) => opt.value === jobDeliveryTime)!==undefined?jobDeliveryOptions.find((opt) => opt.value === jobDeliveryTime):""
                          // jobDeliveryOptions.find((opt) => opt.value === jobDeliveryTime)
                        ]}
                        onChange={(opt) => setJobDeliveryTime(opt[0]?opt[0]['value']:'')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          {currentStep === 3 &&
            // <JobStep3
            //   selectedJobImages={jobDetails?jobDetails[0].name.ImageLinks:''}
            // />
            <div>
              <div className="formRow">
                <div className="formCol">
                  <h3>Images (up to 5)</h3>
                  <p>Get noticed by the right buyers with visual examples of your services.</p>


                  <Form.Item valuePropName="fileList">
                  <Upload 
                    /* action="/upload.do" */ 
                    //customRequest={dummyRequest} 
                    listType="picture-card"
                    maxCount={5}
                    
                    //fileList={fileList}
                    //onPreview={this.handlePreview}
                    //onChange={this.handleUpload}

                    imageLinks
                    defaultFileList={jobImagesOptions}
                    onChange={handleUploadChange}
                    beforeUpload={() => false}
                    accept="image/*"  // .jpg,.png 
                  >
                  <Button classes="button transparent withIcon small flexCol">
                    <i>
                      <PlusIc size="18" />
                    </i>
                    <span>Upload</span>
                    </Button>
                    {/* <div>
                      <PlaceholderIc />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div> */}
                  </Upload>
                  </Form.Item>
                </div>
              </div>
            </div>
          }

          {currentStep === 4 && <JobStep4 />}
        </div>
        {currentStep < 4 && (<div className="formFooter">
          {currentStep > 1 && <Button classes="button transparent" onClick={backStep}>Back</Button>}
          <Button classes="button dark" onClick={validAndNextStep}>
            {(currentStep === 3 || currentStep === 4) ? "Publish" : "Save & Continue"}
          </Button>
        </div>)}
      </div>
    </Fragment>
  )
}

export default JobForm;