import React, { Fragment, useEffect, useState } from "react";
import Moment from "react-moment";
import Button from "./../../components/ui/Button";
import Messages from "../../components/messaging/Messages";
import BackIc from "./../../components/icons/Back";
import { useRouter } from "next/router";
import { MessagesUsersList } from "../../components/messaging/MessagesUsersList";

const Id = (props) => {
  const { currentAccount } = props;
  const router = useRouter();
  const userAddress = router.query.id;
  const [isAddressValid, setIsAddressValid] = useState(true);
  const [userListVisible, setUserListVisible] = useState(true);

  function handleClickUserlist() {
    setUserListVisible(!userListVisible);
  }

  const truncateAccountAddress = userAddress
    ? userAddress.slice(0, 5) + "..." + userAddress.slice(-4)
    : "";
  const lowerCaseCurrentAccount = currentAccount
    ? currentAccount.toLowerCase()
    : "";

  const isValidAddress = (userAddress) => {
    return /^(0x[a-f0-9A-F]{40})$/.test(userAddress);
  };

  useEffect(() => {
    if (userAddress === lowerCaseCurrentAccount) {
      router.push("/inbox");
    }
  }, [userAddress, lowerCaseCurrentAccount, router]);

  useEffect(() => {
    if (userAddress && !isValidAddress(userAddress)) {
      setIsAddressValid(false);
      router.push("/inbox");
    }
  }, [userAddress, router]);

  return (
    <Fragment>
      <div className="wrapper">
        <div className="inbox">
          <MessagesUsersList
            currentAccount={currentAccount}
            userAddress={userAddress}
            userListVisible={userListVisible}
            handleClickUserlist={handleClickUserlist}
          />
          <div className="inboxConservation">
            <div className="inboxConservationTitle">
              <div className="headerBackMobile">
                <i>
                  <BackIc onClick={handleClickUserlist} />
                </i>
              </div>
              <div className="conservationUserInfo">
                {/* <div className="userAvailability">
                  <span className="availabilityCircle isAvailable"></span>
                </div> */}
                <div className="userInfo">
                  <div className="conservationUsername">
                    {truncateAccountAddress}
                  </div>
                  {/* <div className="userStatusAndTime"> */}
                    {/* <div className="availabilityStatus">Online</div> */}
                    <div className="localTime">
                      <Moment format="DD/MM/YYYY - HH:mm" fromNow>
                      </Moment>
                    </div>
                  {/* </div> */}
                </div>
              </div>
              <div className="conservationTitleAction">
                <Button
                  classes="button default small"
                  link={`/user/${userAddress}`}
                >
                  See Profile
                </Button>
              </div>
            </div>
            <div className="inboxConservationContainer">
              <Messages
                currentAccount={currentAccount}
                userAddress={userAddress}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Id;
