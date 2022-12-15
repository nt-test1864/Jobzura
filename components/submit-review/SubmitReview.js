import React, { useState } from "react";
import { message } from "antd";
import { FaStar } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import axios from "axios";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import Image from "next/image";
import { GetWallet_NonMoralis } from "../../JS/local_web3_Moralis.js";
import { SignMessageWithAlias } from "../../JS/auth/messageSigning";
import { CheckAndCreateAlias } from "../../JS/auth/AliasAuthentication";

const fetchJobDetails = async (jobID) => {
  const response = await axios.get(`/api/get/Job?jobID=${jobID}`);
  const data = await response.data;

  return data;
};

const SubmitReview = (props) => {
  const { currentAccount } = props;
  const router = useRouter();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [like, setLike] = useState("");
  const [dislike, setDislike] = useState("");
  const [privateReview, setPrivateReview] = useState(false);
  const jobID = router.query.jobID;
  const [feedback, setFeedback] = useState("");
  const [hoverValue, setHoverValue] = useState(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: jobDetails } = useQuery(
    "JobDetails",
    () => fetchJobDetails(jobID),
    {
      refetchInterval: 1000,
    }
  );

  const jobDetail = jobDetails?.[0];
  const jobSeller = jobDetail?.name?.Seller;
  const jobTitle = jobDetail?.name?.Title;
  const jobPrice = jobDetail?.name?.Price;
  const jobImage = jobDetail?.name?.ImageLinks;
  const jobBuyer = currentAccount;

  let starsNumber = 5;
  let limitCharacters = 1200;
  const stars = Array(starsNumber).fill(0);

  const togglePrivateInfo = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleJobDetails = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleClick = (value) => {
    setRating(value);
  };

  const handleMouseOver = (newHoverValue) => {
    setHoverValue(newHoverValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };

  const onFinish = async () => {
    // check if Alias is present in local storage, if not, create a new one
    const res = await CheckAndCreateAlias();
    if (res == false) {
      return false;
    }

    var formData = new FormData();
    const connectedAddress = (await GetWallet_NonMoralis())[0];

    // run for every parameter to append
    const signedMessage_connectedAddress = await SignMessageWithAlias(
      connectedAddress
    );
    formData.append("address", signedMessage_connectedAddress.address);
    formData.append(
      "message_UserWallet",
      signedMessage_connectedAddress.message
    );
    formData.append(
      "signature_UserWallet",
      signedMessage_connectedAddress.signature
    );

    const signedMessage_review = await SignMessageWithAlias(review);
    formData.append("message_review", signedMessage_review.message);
    formData.append("signature_review", signedMessage_review.signature);

    const signedMessage_rating = await SignMessageWithAlias(rating.toString());
    formData.append("message_rating", signedMessage_rating.message);
    formData.append("signature_rating", signedMessage_rating.signature);

    const signedMessage_privateReview = await SignMessageWithAlias(
      privateReview.toString()
    );
    formData.append(
      "message_privateReview",
      signedMessage_privateReview.message
    );
    formData.append(
      "signature_privateReview",
      signedMessage_privateReview.signature
    );

    const signedMessage_jobID = await SignMessageWithAlias(jobID);
    formData.append("message_jobID", signedMessage_jobID.message);
    formData.append("signature_jobID", signedMessage_jobID.signature);

    const signedMessage_jobSeller = await SignMessageWithAlias(jobSeller);
    formData.append("message_jobSeller", signedMessage_jobSeller.message);
    formData.append("signature_jobSeller", signedMessage_jobSeller.signature);

    const signedMessage_jobBuyer = await SignMessageWithAlias(jobBuyer);
    formData.append("message_jobBuyer", signedMessage_jobBuyer.message);
    formData.append("signature_jobBuyer", signedMessage_jobBuyer.signature);

    const signedMessage_like = await SignMessageWithAlias(like);
    formData.append("message_like", signedMessage_like.message);
    formData.append("signature_like", signedMessage_like.signature);

    const signedMessage_dislike = await SignMessageWithAlias(dislike);
    formData.append("message_dislike", signedMessage_dislike.message);
    formData.append("signature_dislike", signedMessage_dislike.signature);

    //var formData = new FormData();
    //formData.append("review", review);
    //formData.append("rating", rating);
    //formData.append("privateReview", privateReview);
    //formData.append("jobID", jobID);
    //formData.append("jobSeller", jobSeller);
    //formData.append("jobBuyer", jobBuyer);
    //formData.append("like", like);
    //formData.append("dislike", dislike);

    axios.post("/api/general/createReview", formData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please rate the service and the buyer");
    } else {
      setFeedback("Thank you for your feedback !");
      setTimeout(() => {
        setFeedback("");
        router.back();
      }, 3000);
      onFinish();
    }
  };

  const changeColor = () => {
    if (review.length >= limitCharacters) {
      return { color: "red" };
    }
  };

  return (
    <div className="reviewContainer">
      <div className="formBox">
        <div className="submitReviewTitle">
          <h1>Review</h1>
          <div className="reviewNote">
            Please leave a review for {" "}
            <span
              className="reviewJobModel"
              onMouseOver={toggleJobDetails}
              onMouseLeave={toggleJobDetails}
            >
              {jobTitle}.
              {isModalOpen && (
                <>
                  <div className="modal">
                    <div className="modalContent">
                      <h3>{jobTitle}</h3>
                      {jobImage?.length > 0 ? (
                        <Image
                          src={jobImage[0]}
                          width={250}
                          height={100}
                          alt="jobImage"
                          objectFit="contain"
                        />
                      ) : null}
                      <p>Price : {jobPrice}</p>
                      <p>
                        Seller :{" "}
                        {jobSeller?.slice(0, 9) + "..." + jobSeller?.slice(-4)}
                      </p>
                    </div>
                    <div className="polygon"></div>
                  </div>
                </>
              )}
            </span>
          </div>
        </div>

        <div className="starRatting">
          <h2>Rate the buyer</h2>
          <div className="rating">
            {stars.map((_, index) => {
              return (
                <FaStar
                  key={index}
                  size={24}
                  color={index < (hoverValue || rating) ? "#545454" : "#b0b4c1"}
                  onClick={() => handleClick(index + 1)}
                  onMouseOver={() => handleMouseOver(index + 1)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    marginRight: 10,
                    cursor: "pointer",
                  }}
                />
              );
            })}
            <span
              value={rating}
              onChange={(e) => {
                setRating(e.target.value);
              }}
            >
              {rating === 0 ? null : rating}
            </span>
          </div>
        </div>

        <div className="reviewComment">
          <h2>Comments</h2>

          <div className="commentArea">
            <textarea
              className="formControl textarea"
              value={review}
              maxLength="1200"
              onChange={(e) => setReview(e.target.value)}
              rows="5"
              placeholder="Type your review here..."
            />

            <div className="textareaNote" style={changeColor()}>
              {review.length} / {limitCharacters} Characters
            </div>

            <div className="privateCheckbox">
              <input
                type="checkbox"
                value={privateReview}
                onChange={(e) => setPrivateReview(e.target.checked)}
              />
              <div className="checkboxLabel">
                <span>Make a review private </span>
                <AiOutlineInfoCircle
                  onClick={togglePrivateInfo}
                  className="info__icon"
                  size={18}
                  style={{
                    cursor: "pointer",
                    position: "relative",
                  }}
                />
                {isOpen && (
                  <div className="infoTooltip">
                    <p>If you make a review private, no one will see it.</p>
                    <div className="polygon"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="submitButton mt-20">
        <span>{feedback}</span>
        <button
          type="submit"
          className="button dark"
          onClick={handleSubmit}
          disabled={!review.trim()}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default SubmitReview;
