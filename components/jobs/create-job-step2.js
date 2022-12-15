import React, { useState } from "react";
import Select from "react-dropdown-select";

function JobStep2(props) {
  const { selectedJobCurrencyTicker, selectedJobPrice, selectedJobTimeToDeliver } = props;

  const [jobDescriptionBasic, setJobDescriptionBasic] = useState("");
  const [jobPriceCurrencyBasic, setJobPriceCurrencyBasic] = useState(selectedJobCurrencyTicker);
  const [jobPriceBasic, setJobPriceBasic] = useState(selectedJobPrice);
  const [jobDeliveryTime, setJobDeliveryTime] = useState(selectedJobTimeToDeliver);

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
      value: "1 Day",
    },
    {
      label: "3 Day",
      value: "3 Day",
    },
    {
      label: "7 Day",
      value: "7 Day",
    },
    {
      label: "14 Day",
      value: "14 Day",
    },
  ]

  return (
    <div>
      {/* <h2 className="stepHeader">Packages</h2> */}

      <div className="stepFormBlockMain">
        {/* <div className="stepFormBlockHeader">
          <h3>Basic</h3>
        </div> */}
        <div className="stepFormContainer">
          {/* <div className="formRow">
            <div className="formCol">
              <h3>Description</h3>
              <p>Describe the details of your offering.</p>
              <input
                type="text"
                value={jobDescriptionBasic}
                placeholder="Enter a describe"
                className="formControl"
                onChange={(e) => setJobDescriptionBasic(e.target.value)}
              />
            </div>
          </div> */}

          <div className="formRow">
            <div className="formCol">
              <h3>Price</h3>
              <div className="mergeControl">
                <Select
                  options={priceCurrencyOptions}
                  onChange={(opt) => setJobPriceCurrencyBasic(opt)}
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
                onChange={(opt) => setJobDeliveryTime(opt)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* <div className="stepFormBlockMain">
        <div className="stepFormBlockHeader">
          <h3>Standard <span>(Optional)</span></h3>
          <div className="stepFormBlockHeaderActions">
            <button>Delete</button>
          </div>
        </div>
        <div className="stepFormContainer">
          <div className="formRow">
            <div className="formCol">
              <h3>Description</h3>
              <p>Describe the details of your offering.</p>
              <input
                type="text"
                value={jobDescriptionStandard}
                placeholder="Enter a describe"
                className="formControl"
                onChange={(e) => setJobDescriptionStandard(e.target.value)}
              />
            </div>
          </div>

          <div className="formRow">
            <div className="formCol">
              <h3>Price</h3>
              <div className="mergeControl">
                <Select
                  options={priceCurrencyOptions}
                  onChange={(opt) => setJobPriceCurrencyStandard(opt)}
                  className="jobCurrencyDropdown"
                />
                <input
                  type="text"
                  value={jobPriceStandard}
                  placeholder="Enter a price"
                  className="formControl"
                  onChange={(e) => setJobPriceStandard(e.target.value)}
                />
              </div>
            </div>
            <div className="formCol">
              <h3>Delivery time</h3>
              <Select
                options={jobDeliveryOptions}
                onChange={(opt) => setJobPriceCurrencyStandard(opt)}
              />
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="stepFormBlockMain">
        <div className="stepFormBlockHeader">
          <h3>Premium <span>(Optional)</span></h3>
          <div className="stepFormBlockHeaderActions">
            <button>Add</button>
          </div>
        </div>
        <div className="stepFormContainer">

        </div>
      </div> */}

    </div>
  );
}

export default JobStep2;
