import { Fragment, useState } from "react";
import axios from "axios";
import PencilIc from "../icons/Pencil";
import ModalUi from "../ui/ModalUi";

import EditUsername from "./edit-username";
import { GetWallet_NonMoralis } from '../../JS/local_web3_Moralis.js';
import { SignMessageWithAlias } from "../../JS/auth/messageSigning";
import { CheckAndCreateAlias } from "../../JS/auth/AliasAuthentication";

function Username(props) {
  const { userProfile, currentAccount } = props;

  const [username, setUsername] = useState(userProfile.Username);
  const [modelData, setModelData] = useState({
    show: false,
    type: "alert",
    status: "Error",
    message: "",
  });

  const updateUsername = async (username) => {

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

    const signedMessage_O = await SignMessageWithAlias("Username");
    formData.append("message_O", signedMessage_O.message);
    formData.append("signature_O", signedMessage_O.signature);

    const signedMessage_objectId = await SignMessageWithAlias(userProfile[0].name.objectId);
    formData.append("message_objectId", signedMessage_objectId.message);
    formData.append("signature_objectId", signedMessage_objectId.signature);

    const signedMessage_Username = await SignMessageWithAlias(username);
    formData.append("message_Username", signedMessage_Username.message);
    formData.append("signature_Username", signedMessage_Username.signature);
    
      

    //var formData = new FormData();
    //formData.append("O", "Headline");
    //formData.append("objectId", userProfile.objectId);
    //formData.append("Headline", headline);

    await axios
      .post("/api/general/updateMyProfile", formData)
      .then((res) => {
        // if (res.status == 201 ) message.success("data successfully updated!");
        // this.fetchExtrashift();
      })
      .catch((err) => {
        // message.error("data profile failed to update ...");
      });
  };

  function closeModelDataHandler() {
    setModelData({
      show: false,
    });
  }

  function saveUserUsernameHandler(username) {
    // console.log("your title has been saved!");
    updateUsername(username);
    setModelData({ show: false });
  }

  return (
    <Fragment>
      <div className="userHeadline">
        {userProfile[0].name.Username ? (
          <h3>{userProfile[0].name.Username}</h3>
        ) : (
          <div className="blockPlaceholder">Add your name...</div>
        )}
        {userProfile[0]?.name.userAddress?.toLowerCase() ===
          currentAccount.toLowerCase() && (
          <i>
            <PencilIc
              size="16"
              onClick={() =>
                setModelData({
                  show: true,
                  type: "modal",
                  title: "Edit your username",
                  body: (
                    <EditUsername
                      userName={username}
                      setUsername={setUsername}
                      saveUsername={saveUserUsernameHandler}
                      closeModelFn={closeModelDataHandler}
                      userProfile={userProfile}
                    />
                  ),
                })
              }
            />
          </i>
        )}
      </div>

      <ModalUi content={modelData} closeModelFn={closeModelDataHandler} />
    </Fragment>
  );
}

export default Username;
