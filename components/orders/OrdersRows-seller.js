import { useRef, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import Link from "next/link";
import Button from "../ui/Button";
import useOutsideClick from "../useOutsideClick";
import {
  AcceptOfferSeller_Moralis,
  ClaimFunds_Moralis,
  ReturnPayment_Moralis,
  GetWallet_NonMoralis, 
} from '../../JS/local_web3_Moralis.js';
import Moment from "react-moment";
import Image from "next/image";
import makeBlockie from "ethereum-blockies-base64";

function OrdersRowsSeller(props) {
  const { agreement } = props;
  const [showModal, setShowModal] = useState(false);

  // opening a new modal closes the previous one
  const handleModal = () => {
    setShowModal(!showModal);
  };

  const moreOptionsRef = useRef();
  useOutsideClick(moreOptionsRef, () => {
    if (moreOptionsRef) setShowModal(false);
  });

  async function GetUserReferralChain(userWallet){
    const data = await fetch(`../api/get/ReferralChain3?userWallet=${userWallet}`)
      .then((res) => res.json());
    return data;
  }

  const TimeToDeliver = agreement.name.TimeToDeliver;
  const createdAt = agreement.name.Created._seconds;
  const date = new Date(createdAt);
  const dueOn = new Date(date.getTime() * 1000 + TimeToDeliver * 24 * 60 * 60 * 1000);

  return (
    <tr>
      <td align="left">
        {/* <h3>{agreement.name.Title}</h3> */}
        <div className="jobDetails">
          <div className="jobThumb"></div>
          <div className="jobSortInfo">
            <h3>{agreement.name.Title}</h3>
            <p>{agreement.name.Description}</p>
          </div>
        </div>
      </td>
      <td align="left">
        <label className="mobileLabel">Buyer</label>
        <div className="sellerDetails">
          {agreement.name.BuyerWallet && agreement.name.BuyerWallet.length > 0 ? 
            (
              <>
                <Image
                src={makeBlockie(agreement.name.BuyerWallet)}
                alt="buyer"
                width={40}
                height={40}
                style={{ borderRadius: "50%" }}
                />

                <div className="sellerSortInfo">
                  {agreement.name.BuyerWallet.slice(0, 6) +
                    "..." +
                    agreement.name.BuyerWallet.slice(-4)}
                </div>
              </>
            ) : <div className="sellerPic"></div>
          }

        </div>
      </td>
      <td align="left">
        <label className="mobileLabel">Order date</label>
        <Moment 
          format="DD MMM YYYY"
          date={new Date(createdAt * 1000)}
        />
      </td>
      <td align="left">
        <label className="mobileLabel">Due on</label>
        <Moment 
          format="DD MMM YYYY"
          date={dueOn}
        />
      </td>
      <td align="left">
        <label className="mobileLabel">Price</label>
        {agreement.name.Price_formatted} {agreement.name.CurrencyTicker}
      </td>
      <td align="left">
        <label className="mobileLabel">Status</label>
        {agreement.name.State === "Available" && (
          <span className="statusChip statusAvailableBuyers">
            Available To Buyers
          </span>
        )}
        {agreement.name.State === "buyer_initialized_and_paid" && (
          <span className="statusChip statusQualifiedSellers">
            Specifying Qualified Sellers
          </span>
        )}
        {agreement.name.State === "await_seller_accepts" && (
          <span className="statusChip statusAvailableSellers">
            Available To Sellers
          </span>
        )}
        {agreement.name.State === "in progress" && (
          <span className="statusChip statusInProgress">In Progress</span>
        )}
        {agreement.name.State === "complete" && (
          <span className="statusChip statusComplete">Complete</span>
        )}
        {agreement.name.State === "in dispute" && (
          <span className="statusChip statusDispute">In Dispute</span>
        )}
        {agreement.name.State === "canceled" && (
          <span className="statusChip statusCanceled">Canceled</span>
        )}
        {/* <span className="statusChip statusInProgress">
          {agreement.name.State}
        </span> */}
      </td>
      <td align="left" ref={moreOptionsRef}>
        {agreement.name.Index && agreement.name.State !== "canceled" && agreement.name.State !== "in dispute" && (
          <Button onClick={handleModal} classes="button bordered default moreButton">
            <FiMoreVertical
              style={{
                fontSize: "1.2rem",
                color: "grey",
                cursor: "pointer",
              }}
            />
              {
                showModal && agreement.name.State === "complete" ? (
                  <div className="moreOptionDropdown">
                    <Link href={`/submit-review?jobID=${agreement.name.Index}`}>
                      <span>Writing a review</span>
                    </Link>
                  </div>
                ) : 

                showModal && agreement.name.State === "buyer_initialized_and_paid" ? (
                  <div className="moreOptionDropdown">
                    <span
                      onClick={async() =>
                        AcceptOfferSeller_Moralis(agreement.name.CurrencyTicker, agreement.name.Index, await GetUserReferralChain((await GetWallet_NonMoralis())[0]))
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
                    >Accept order</span>
                  </div>
                ) : 

              showModal && agreement.name.State === "in progress" ? (
                <div className="moreOptionDropdown">
                  <span
                    onClick={() =>
                      ReturnPayment_Moralis(agreement.name.CurrencyTicker, agreement.name.Index)
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
                  >Return Funds</span>
                  <span
                    onClick={() =>
                      ClaimFunds_Moralis(agreement.name.CurrencyTicker, agreement.name.Index)
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
                  >Claim funds</span>
                </div>
              ) : 

              ( null )
            }
          </Button>
        )}
      </td>
    </tr>
  );
}

export default OrdersRowsSeller;
