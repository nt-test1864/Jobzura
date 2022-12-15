import React, { Fragment, useState } from "react";
import { ImBubbles2 } from "react-icons/im";
import { MessagesUsersList } from "../../components/messaging/MessagesUsersList";

const index = (props) => {
  const { currentAccount, userAddress } = props;

  return (
    <Fragment>
      <div className="wrapper">
        <div className="inbox">
          {!currentAccount ? (
            <>
              <div className="inboxList_blurred">
                <MessagesUsersList
                  currentAccount={currentAccount}
                  userAddress={userAddress}
                />
              </div>
              <div className="inbox__chat">
                <ImBubbles2 size={100} />
                <h1>Connect with your wallet to access your messages</h1>
              </div>
            </>
          ) : (
            <>
              <MessagesUsersList
                currentAccount={currentAccount}
                userAddress={userAddress}
              />
              <div className="inbox__chat">
                <ImBubbles2 size={100} />
                <h1>Select a Conversation</h1>
              </div>
            </>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default index;
