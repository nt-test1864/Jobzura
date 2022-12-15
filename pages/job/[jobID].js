import React, { Fragment } from "react";
import {
  CreateEscrow_Moralis,
  GetWallet_NonMoralis,
  PayzuraCentealizedArbiter,
} from "../../JS/local_web3_Moralis.js";
import { sha256 } from "js-sha256";
import { useRouter } from "next/router.js";
import { useQuery } from "react-query";
import axios from "axios";
import Image from "next/image";
import makeBlockie from "ethereum-blockies-base64";
import AboutSeller from "../../components/job-details/AboutSeller.js";
import MessageIc from "../../components/icons/Message";
import { FaStar } from "react-icons/fa";
import JobDetailsImages from "../../components/job-details/JobDetailsImages.js";
import Link from "next/link.js";

async function GetUserReferralChain(userWallet) {
  //const data = await fetch(
  //  `../api/get/ReferralChain3?userWallet=${userWallet}`
  //).then((res) => res.json()); //.then((json) => setData(json)); // uncomment this line to see the data in the console
  //return data;

  return ["0x1591C783EfB2Bf91b348B6b31F2B04De1442836c"];
}

function JobDetails() {
  const router = useRouter();
  const jobID = router.query.jobID;

  const fetchJobDetails = async (jobID) => {
    const jobDetails = await axios.get(`/api/V2-Firebase/get/Job?JobID=${jobID}`);
    return jobDetails.data;
  };

  const { data, isLoading } = useQuery(["JobDetails", jobID], () =>
    fetchJobDetails(jobID)
  );

  const jobDetails = data;

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const jobSellerAddress = jobDetails[0]?.name.SellerWallet.stringValue;
  const jobTitle = jobDetails[0]?.name.Title.stringValue;
  const jobImage = jobDetails[0]?.name.ImageLinks?.arrayValue.values;
  const jobDescription = jobDetails[0]?.name.Description.stringValue;
  const jobTimeToDeliver = jobDetails[0]?.name.TimeToDeliver.stringValue;
  const jobPrice = jobDetails[0]?.name.Price.stringValue;
  const jobCurrency = jobDetails[0].name.CurrencyTicker.stringValue;
  const jobSellerAddressTruncated = jobSellerAddress?.substring(0, 6) + "..." + jobSellerAddress?.substring(36, 42);

  const ratingArray = jobDetails[0]?.name.Rating.arrayValue;
  const numberOfRatings = ratingArray?.values?.length;

  if (ratingArray?.length > 0) {
    var ratingAverage = (
      ratingArray.reduce((a, b) => a + b, 0) / ratingArray.length
    ).toFixed(1);
  }

  let numberOfStars = 5;
  const stars = Array(numberOfStars).fill(0);

  const fiveStar = ratingArray?.values?.filter((rating) => rating.integerValue == 5);
  const fourStar = ratingArray?.values?.filter((rating) => rating.integerValue == 4);
  const threeStar = ratingArray?.values?.filter((rating) => rating.integerValue == 3);
  const twoStar = ratingArray?.values?.filter((rating) => rating.integerValue == 2);
  const oneStar = ratingArray?.values?.filter((rating) => rating.integerValue == 1);

  const fiveStarRating = (fiveStar?.length / numberOfRatings) * 5;
  const fourStarRating = (fourStar?.length / numberOfRatings) * 4;
  const threeStarRating = (threeStar?.length / numberOfRatings) * 3;
  const twoStarRating = (twoStar?.length / numberOfRatings) * 2;
  const oneStarRating = (oneStar?.length / numberOfRatings) * 1;

  const totalRating = (
    fiveStarRating +
    fourStarRating +
    threeStarRating +
    twoStarRating +
    oneStarRating
  ).toFixed(1);

  if (5 <= totalRating && totalRating > 4.9) {
    numberOfStars = 5;
  } else if (4 <= totalRating && totalRating < 4.9) {
    numberOfStars = 4;
  } else if (3 <= totalRating && totalRating < 3.9) {
    numberOfStars = 3;
  } else if (2 <= totalRating && totalRating < 2.9) {
    numberOfStars = 2;
  } else if (1 <= totalRating && totalRating < 1.9) {
    numberOfStars = 1;
  } else {
    numberOfStars = 0;
  }

  
  if (data) {
    return (
      <Fragment>
        <div className="wrapper jobDetailsWpr">
          {/* left side */}
          <div className="jobDetailsMain">
            <h1 className="jobDetailsTitle">{jobTitle}</h1>
            <div className="jobDetailsHeader">
              <span className="profilePic">
                {jobDetails[0] ? (
                  <Image
                  src={makeBlockie(jobSellerAddress)}
                  width="50%"
                  height="50%"
                  alt={jobSellerAddress}
                  style={{ borderRadius: "50%" }}
                />
                ) : null}
              </span>

              <h3 className="ml-10">{jobSellerAddressTruncated}</h3>
              
              <div className="jobDetailsHeader--right">
                <div className="starsRatings">
                  {stars.map((_, index) => {
                    return (
                      <FaStar
                        key={index}
                        size={18}
                        className={index < numberOfStars ? "activeStar" : "disableStar"}
                        style={{ marginRight: 5 }}
                      />
                    );
                  })}
                </div>
                <h4 className="ratingCounts">
                  {totalRating === "NaN" ? "No Ratings" : totalRating}(
                  {ratingArray?.values?.length})
                </h4>
              </div>
            </div>

            <div className="jobDetailsDescription">
              <div className="jobDetailsDescriptionImage">
                {jobImage && jobImage.length > 0 ? (
                  <JobDetailsImages images={jobImage} alt={jobTitle} />
                ) : (
                  <div className="placeholderImage"></div>
                )}
              </div>

              <div className="jobDetailsDescriptionText">
                <p>{jobDescription}</p>
              </div>

              <div className="jobDetailsDescriptionAbout">
                <h2>About the seller</h2>
                <AboutSeller
                  jobSellerAddress={jobSellerAddress}
                  jobDescription={jobDescription}
                />
              </div>
            </div>
          </div>

          {/* right side */}
          <div className="buySection">
            <div className="buySectionContainer">
              <h1>{jobPrice} {jobCurrency}</h1>
              <h3>{jobTimeToDeliver} Day(s) Delivery</h3>
              <div className="actionButton">
                <button
                  className="button dark"
                  type="submit"
                  onClick={async () =>
                    CreateEscrow_Moralis(
                      jobCurrency,
                      true, // buyer initialized the contract
                      (await GetWallet_NonMoralis())[0],
                      jobPrice, // also depends on basic, standard, premium
                      "ETH", // expected values: `ETH`, `USDC` - just means the native currency and not ERC20 .... needs better naming for sure
                      await GetUserReferralChain((await GetWallet_NonMoralis())[0]), // referrerAddress
                      jobTimeToDeliver, // 0 for testing only, real value more like:  24 * 7, // the value should be in hours - take 7 days for now, it should be read from the job (also depends on basic, standard, premium)
                      sha256(jobDescription),
                      Math.floor(Date.now() / 1000 + 365 * 24 * 60 * 60), // make it valid far in the future (e.g. 1 y or something like this...)
                      jobSellerAddress, // get the seller wallet and put it in array
                      PayzuraCentealizedArbiter // Payzura centralized wallet for now
                    )
                    .catch((error) => {
                      console.error(error);
                      console.log("create offer error code: " + error.code);
                      console.log(
                        "create offer error message: " + error.message
                      );
                      if (error.data && error.data.message) {
                        console.log(error.data.message);
                      } else {
                        console.log(error.message);
                      }
                      process.exitCode = 1;
                    })
                  }
                >
                  <span>Continue ({jobPrice} {jobCurrency})</span>
                </button>
              </div>
              <div className="actionButton--bottom">
                <Link href={`/inbox/${jobSellerAddress}`}>
                  <button className="button withIcon">
                    <i>
                      <MessageIc />
                    </i>
                    <span>Message Seller</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default JobDetails;
