import { message } from 'antd';
import Link from "next/link";
import { Fragment, useState } from "react";
import { FaStar } from "react-icons/fa";
import JobsImages from "./jobs-images";
import Button from "../ui/Button";
import ModalUi from "../ui/ModalUi";
import EditJob from "./edit-job";
import axios from "axios";
import { GetWallet_NonMoralis } from '../../JS/local_web3_Moralis.js';
import { SignMessageWithAlias } from "../../JS/auth/messageSigning";
import { CheckAndCreateAlias } from "../../JS/auth/AliasAuthentication";


function JobItem(props) {
  const updateDataFn = props.updateDataFn;
  const title = props.item.name.Title;
  const images = props.item.name.ImageLinks;
  const description = props.item.name.Description;
  const price = props.item.name.Price;
  const currency = props.item.name.CurrencyTicker;
  const jobLink = props.item.name.JobId;
  const objectId = props.item.name.objectId;
  let rating = props.item.name.Rating;

  if (rating === undefined || rating === null) {
    rating = 0;
  }

  let averageRating = 0;
  if (rating.length > 0) {
    let total = 0;
    for (let i = 0; i < rating.length; i++) {
      total += rating[i];
    }
    averageRating = total / rating.length;
  }

  const numberOfReviews = rating.length;

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  const [modelData, setModelData] = useState({
    show: false,
    type: "alert",
    status: "Error",
    message: "",
  });

  function closeModelDataHandler() {
    setModelData({
      show: false,
    });
  }

  const updateJobDetail = async (title, description, price, timeToDeliver) => {

    // check if Alias is present in local storage, if not, create a new one
    const res = await CheckAndCreateAlias();
    if (res == false) { return false; }

    var formData = new FormData();
    const connectedAddress = (await GetWallet_NonMoralis())[0];

    // run for every parameter to append
    const signedMessage_objectId = await SignMessageWithAlias(objectId);
    formData.append("message_objectId", signedMessage_objectId.message);
    formData.append("signature_objectId", signedMessage_objectId.signature);

    let seller = "0x2c5f037879eD7E0AC328531987b04a15620E8BFE";
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

    const signedMessage_timeToDeliver = await SignMessageWithAlias(timeToDeliver);
    formData.append("message_timeToDeliver", signedMessage_timeToDeliver.message);
    formData.append("signature_timeToDeliver", signedMessage_timeToDeliver.signature);

    axios.post("/api/general/updateJob", formData)
      .then((res) => {
        if (res.status == 201) message.success("data successfully updated!");
        this.fetchExtrashift();
        updateDataFn()
      })
      .catch((err) => {
        message.error("data failed to update ...");
        updateDataFn()
      });

    // const signedMessage_Headline = await SignMessageWithAlias("Headline");
    // formData.append("message_Headline", signedMessage_Headline.message);
    // formData.append("signature_Headline", signedMessage_Headline.signature);
  };

  function saveJobDetailHandler(title, description, price, timeToDeliver) {
    // console.log("your title has been saved!");
    updateJobDetail(title, description, price, timeToDeliver);
    setModelData({ show: false });
  }


  return (
    <Fragment>
      <div className="gigBlock">
        <div className="blockAction">
          <Button classes="button dark small"
            link={`/edit-job/${jobLink}`}
            // onClick={() =>
            //   setModelData({
            //     show: true,
            //     type: "modal",
            //     title: `Edit ${title}`,
            //     body: (
            //       <EditJob item={props.item}
            //         saveJobDetailFn={saveJobDetailHandler}
            //         closeModelFn={closeModelDataHandler}
            //       />
            //     ),
            //   })
            // }
          >Edit Job</Button>
        </div>
        <Link href={`/job/${jobLink}`}>
          <div className="blockInner">
            <div className="blockThumb">
              {images?.length > 0 ? (
                <div className="imageGaller">
                  <JobsImages images={images} alt={title} />
                </div>
              ) : (
                <div className="placeholderImage"></div>
              )}
            </div>
            <div className="blockContent">
              <div className="blockDetails">
                <div className="blockTitle">{title}</div>
                <div className="blockDescription">
                  {truncate(description, 130)}
                </div>
              </div>
              <div className="blockFooter">
                <div className="gigRateReview">
                  <div className="gigStars">
                    <div className="startRattings">
                      <i>
                        {averageRating === 0 ? (
                          <FaStar size={16} className="disableStar" />
                        ) : (
                          <FaStar size={16} className="activeStar" />
                        )}
                      </i>
                    </div>
                    <div className="rattingCounts">
                      {averageRating === 0 ? "0" : averageRating.toFixed(1)}
                    </div>
                  </div>
                  <div className="gigTotalReviews">
                    ({rating === 0 ? "0 Review" : numberOfReviews})
                  </div>
                </div>
                <div className="gigPrice">{price} {currency}</div>
              </div>

              {/*
            <div className="blockFooter">
              <div className="gigRateReview">
                <div className="gigStars">
                  <div className="startRattings">
                    <i className="fill">
                      <StarIc />
                    </i>
                  </div>
                  <div className="rattingCounts">4.5</div>
                </div>

                <div className="gigTotalReviews">(15)</div>
              </div>
              <div className="gigPrice">${price}</div>
              {/* <Link href={`/job/${jobLink}`}>View Details</Link>
            </div> 
            */}
            </div>
          </div>
        </Link>
      </div>

      <ModalUi content={modelData} closeModelFn={closeModelDataHandler} />
    </Fragment>
  );
}

export default JobItem;
